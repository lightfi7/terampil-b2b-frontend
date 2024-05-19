import axios from 'axios';
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from 'data-design/src/entity/EmployeeKeyResultData.entity';
import { KeyResult } from 'data-design/src/entity/KeyResult.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import moment from 'moment';
import XLSX from 'sheetjs-style';

export interface IPagination<T> {
  total: number;
  data: T[];
}

export function openExcelBuffer(
  buffer: any, 
  filename: string = new Date().getTime().toString()) {
  const blob = new Blob([buffer]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${filename}.xlsx`;
  link.click();
}

export function trimSpecial(s: string, max: number = 20): string {
  return `${s.slice(0, max)}${s.length > max ? '...' : ''}`;
}

export function getMonthsToNowFrom(date: Date): Date[] {
  const now = moment();
  const process_date = moment(date);
  process_date.set('date', 1);
  process_date.set('hour', 0);
  process_date.set('minute', 0);
  process_date.set('second', 0);
  const list_date: Date[] = [];
  while (process_date.isBefore(now, 'hour')) {
    list_date.push(process_date.toDate());
    process_date.add(1, 'month');
  }
  return list_date;
}

export async function uploadFile(file: any, _setLoading: (_: boolean) => void) {
  if (!file) {
    return;
  }
  _setLoading(true);
  try {
    const form_data = new FormData();
    form_data.append('file', file);
    const filename: string = (await axios.post('/upload', form_data)).data;
    return filename;
  } catch (err: any) {
    alert(err.response.data.toString());
  } finally {
    _setLoading(false);
  }
}

export function convertDuration(duration: number) {
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);

  return hours + ' jam ' + minutes + ' menit';
}

export function formatLocaleDateShort(date: Date) {
  return moment(date).local().format('DD/MM/YYYY');
}

export function convertDurationSecond(duration: number) {
  let hours = Math.floor(duration / 3600).toString();
  let minutes = Math.floor((duration % 3600) / 60).toString();
  let second = (duration % 60).toString();

  if (second.length === 1) {
    second = '0'.concat(second);
  }

  if (minutes.length === 1) {
    minutes = '0'.concat(minutes);
  }
  if (hours.length === 1 && hours !== '0') {
    hours = '0'.concat(hours);
  }

  if (hours === '0') {
    return minutes + ':' + second;
  } else {
    return hours + ':' + minutes + ':' + second;
  }
}

export function randomizeArray(array: string[]) {
  if (!array) return [];

  const randArray = [];
  const arr = [...array];

  while (arr.length > 0) {
    const rand = Math.floor(Math.random() * arr.length);
    randArray.push(arr[rand]);
    arr.splice(rand, 1);
  }

  return randArray;
}

export function downloadBlob(buffer: string, output_filename?: string) {
  const url = window.URL.createObjectURL(new Blob([buffer]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', output_filename ?? 'export.csv'); //or any other extension
  document.body.appendChild(link);
  link.click();
}

export function randomColor() {
  return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

export interface ExcelBufferInputItem {
  title: string
  header: string[]
  data: [{[key: string]: string | number}]
}

export function getExcelBuffer(data: ExcelBufferInputItem[]) {
  const wb = XLSX.utils.book_new();
  for (const item of data) {
    const ws = XLSX.utils.json_to_sheet(item.data, {
      header: item.header
    });
    XLSX.utils.book_append_sheet(wb, ws, item.title);
  }
  
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
}

export function calculateObjective(list_key_result?: KeyResult[]): number {
  const list_pencapaian = list_key_result?.map((kr: KeyResult) => {
    const kr_approved_value = kr.list_key_result_data.filter((a: EmployeeKeyResultData) => a?.status === EmployeeKeyResultStatus.APPROVE).reduce((acc: number, p: EmployeeKeyResultData) => acc + +(p?.value), 0);
    return kr.target == 0 ? 0 : Math.min(
      kr_approved_value / +(kr?.target ?? 1),
      1
    ) * +(kr?.weight ?? 0) / 100;
  }) ?? [];
  return list_pencapaian.reduce((acc: number, curr: number) => acc + curr, 0) * 100;
}

export function calculateOKR(list_objective?: Objective[]): number {
  const temp = list_objective?.map((objektif: Objective) => {
    return (calculateObjective ?? (() => 0))(objektif.list_key_result) / 100 * (objektif?.weight ?? 0) / 100;
  }) ?? [];
  return temp.reduce((acc: number, curr: number) => acc + curr, 0) * 100;
}

export interface TrainingBudgetInGroupLibrary {
  id: string
  library: Library
  list_proposal: TrainingProposal[]
}

export function groupTrainingProposalIntoLibraryGroup(list_proposal: TrainingProposal[]): TrainingBudgetInGroupLibrary[] {
  const time_sorted_data = list_proposal.sort((a, b) => moment(a.training_date).unix() - moment(b.training_date).unix());
  const grouped_data = _.groupBy(time_sorted_data, x => `${x.library.id};${moment(x.training_date).format('DD-MM-YYYY')}`);
  return Object.keys(grouped_data).map((lib_id_proposal_date) => {
    const [library_id, iso_date] = lib_id_proposal_date.split(';');
    const temp: TrainingBudgetInGroupLibrary = {
      id: lib_id_proposal_date,
      library: time_sorted_data.find((tp: TrainingProposal) => String(tp.library.id) == library_id)!.library,
      list_proposal: grouped_data[lib_id_proposal_date]
    };
    return temp;
  });
}

// export function calculateOKR

interface BadgeLabelProgressParam {
  start_date: Date
  target_date: Date
  current_value: number
  target_value: number
}

export function getBadgeLabelProgress(param: BadgeLabelProgressParam) {
  const total_month = moment(param.start_date).diff(param.target_date, 'months');
  const monthly_delta = param.target_value / total_month;
  const month_diff = moment(param.start_date).diff(new Date(), 'months');
  if (month_diff === 0) {
    return 'On Progress'
  }
  const desired_current_value = month_diff * monthly_delta;
  if ((month_diff + 1) === total_month) {
    const success_percent = param.current_value / param.target_value;
    if (success_percent < .8) {
      return 'Need Improvement';
    }
    if (success_percent >= .8 && success_percent < .9) {
      return 'Good';
    }
    return 'Excellent';
  }
  if (param.current_value < desired_current_value) {
    return 'At Risk';
  }
  return 'On Track';
}
