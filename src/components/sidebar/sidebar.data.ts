import { ItemSidebarProps } from "./ItemSidebar";

export const SIDEBAR_CEO: ItemSidebarProps[] = [{
  label: 'Dashboard',
  logo: '/icons/light/icon-sidebar-dashboard.svg',
  logoActive: '/icons/light/icon-sidebar-dashboard.svg',
  items: [{
    label: 'Dashboard',
    href: '/main',
  }, {
    label: 'Executive Summary',
    href: '/main/executive-summary'
  }, {
    label: 'Peta Indonesia',
    href: '/main/peta-indonesia'
  }, {
    label: 'OKR Divisi',
    href: '/main/okr-divisi'
  }]
}, {
  label: 'Organization & Employee',
  logo: '/icons/light/icon-sidebar-organization.svg',
  logoActive: '/icons/light/icon-sidebar-organization.svg',
  items: [{
    label: 'Organization Structure',
    href: '/main/organization/structure',
  }, {
    label: 'Employee',
    href: '/main/organization/employee',
  }]
}, {
  label: 'OKRs',
  logo: '/icons/light/icon-sidebar-okr.svg',
  logoActive: '/icons/light/icon-sidebar-okr.svg',
  items: [{
    label: 'OKR Organisasi',
    href: '/main/okr',
  }, {
    label: 'OKR Karyawan',
    href: '/main/okr?type=karyawan',
  }]
}, {
  label: 'Training & Event',
  logo: '/icons/light/icon-sidebar-training-event.svg',
  logoActive: '/icons/light/icon-sidebar-training-event.svg',
  items: [{
    label: 'Training Wajib',
    href: '/main/training-event/training-wajib',
  }, {
    label: 'Group Learning',
    href: '/main/training-event/group-learning',
  }, {
    label: 'E-Library',
    href: '/main/e-library',
  // }, {
  //   label: 'Event',
  //   href: '/main/training-event/event',
  }]
}, {
  label: 'Training & Budget',
  logo: '/icons/light/icon-sidebar-training-budget.svg',
  logoActive: '/icons/light/icon-sidebar-training-budget.svg',
  items: [{
    label: 'Budgeting',
    href: '/main/training-budget/budgeting',
  }, {
    label: 'Plan & Budget Final',
    href: '/main/training-budget/plan-budget-final',
  }, {
    label: 'Realisasi',
    href: '/main/training-budget/realisasi',
  }]
}, {
  label: 'ROTI',
  logo: '/icons/light/icon-sidebar-roti.svg',
  logoActive: '/icons/light/icon-sidebar-roti.svg',
  items: [{
    label: 'Detail ROTI',
    href: '/main/roti',
  }]
}];

export const SIDEBAR_TEAM: ItemSidebarProps[] = [{
  label: 'Dashboard',
  logo: '/icons/light/icon-sidebar-dashboard.svg',
  logoActive: '/icons/light/icon-sidebar-dashboard.svg',
  items: [{
    label: 'Dashboard',
    href: '/main',
  }]
}, {
  label: 'Organization & Employee',
  logo: '/icons/light/icon-sidebar-organization.svg',
  logoActive: '/icons/light/icon-sidebar-organization.svg',
  items: [{
    label: 'Organization Structure',
    href: '/main/organization/structure',
  }, {
    label: 'Employee',
    href: '/main/organization/employee',
  }]
}, {
  label: 'My Team OKRs',
  logo: '/icons/light/icon-sidebar-organization.svg',
  logoActive: '/icons/light/icon-sidebar-organization.svg',
  items: [{
    label: 'Team Members OKRs',
    href: '/main/team/okr',
  }, {
    label: 'My Team Development',
    href: '/main/team/development',
  }]
}, {
  label: 'Library',
  logo: '/icons/light/icon-sidebar-library.svg',
  logoActive: '/icons/light/icon-sidebar-library.svg',
  items: [{
    label: 'Knowledge & Training',
    href: '/main/library/knowledge-training',
  }, {
    label: 'Competency Dictionary',
    href: '/main/library/competency-dictionary',
  }, {
    label: 'Pre-Made OKRs',
    href: '/main/library/pre-made-okrs',
  }]
}, {
  label: 'Training & Event',
  logo: '/icons/light/icon-sidebar-training-event.svg',
  logoActive: '/icons/light/icon-sidebar-training-event.svg',
  items: [{
    label: 'Training Wajib',
    href: '/main/training-event/training-wajib',
  }, {
    label: 'Group Learning',
    href: '/main/training-event/group-learning',
  }, {
    label: 'E-Library',
    href: '/main/e-library',
  }]
}];

export const SIDEBAR_PERSONAL: ItemSidebarProps[] = [{
  label: 'Dashboard',
  logo: '/icons/light/icon-sidebar-dashboard.svg',
  logoActive: '/icons/light/icon-sidebar-dashboard.svg',
  items: [{
    label: 'Dashboard',
    href: '/main',
  }]
}, {
  label: 'Organization & Employee',
  logo: '/icons/light/icon-sidebar-organization.svg',
  logoActive: '/icons/light/icon-sidebar-organization.svg',
  items: [{
    label: 'Organization Structure',
    href: '/main/organization/structure',
  }]
}, {
  label: 'My OKRs',
  logo: '/icons/light/icon-sidebar-organization.svg',
  logoActive: '/icons/light/icon-sidebar-organization.svg',
  items: [{
    label: 'My OKRs',
    href: '/main/me/okr',
  }, {
    label: 'My Development',
    href: '/main/me/development',
  }, {
    label: 'My Competency',
    href: '/main/me/competency',
  }]
}, {
//   label: 'My Development',
//   logo: '/icons/light/icon-sidebar-library.svg',
//   logoActive: '/icons/light/icon-sidebar-library.svg',
//   items: [{
//     label: 'My IDP',
//     href: '/main/library/knowledge-training',
//   }, {
//     label: 'Upcoming Activities',
//     href: '/main/library/knowledge-training',
//   }, {
//     label: 'On Going Learning',
//     href: '/main/library/knowledge-training',
//   }]
// }, {
  label: 'Training & Event',
  logo: '/icons/light/icon-sidebar-training-event.svg',
  logoActive: '/icons/light/icon-sidebar-training-event.svg',
  items: [{
    label: 'Training Wajib',
    href: '/main/training-event/training-wajib',
  }, {
    label: 'Group Learning',
    href: '/main/training-event/group-learning',
  }, {
    label: 'E-Library',
    href: '/main/e-library',
  // }, {
  //   label: 'Event',
  //   href: '/main/training-event/event',
  }]
}];

export const SIDEBAR_HR: ItemSidebarProps[] = [{
  label: 'Dashboard',
  logo: '/icons/light/icon-sidebar-dashboard.svg',
  logoActive: '/icons/light/icon-sidebar-dashboard.svg',
  items: [{
    label: 'Dashboard',
    href: '/main',
  }, {
    label: 'Peta Indonesia',
    href: '/main/peta-indonesia'
  }, {
    label: 'OKR Divisi',
    href: '/main/okr-divisi'
  }]
}, {
  label: 'Organization & Employee',
  logo: '/icons/light/icon-sidebar-organization.svg',
  logoActive: '/icons/light/icon-sidebar-organization.svg',
  items: [{
    label: 'Organization Structure',
    href: '/main/organization/structure',
  }, {
    label: 'Employee',
    href: '/main/organization/employee',
  }]
}, {
  label: 'OKRs',
  logo: '/icons/light/icon-sidebar-okr.svg',
  logoActive: '/icons/light/icon-sidebar-okr.svg',
  items: [{
    label: 'OKR Organisasi',
    href: '/main/okr',
  }, {
    label: 'OKR Karyawan',
    href: '/main/okr?type=karyawan',
  }]
}, {
  label: 'Training & Event',
  logo: '/icons/light/icon-sidebar-training-event.svg',
  logoActive: '/icons/light/icon-sidebar-training-event.svg',
  items: [{
    label: 'Training Wajib',
    href: '/main/training-event/training-wajib',
  }, {
    label: 'Group Learning',
    href: '/main/training-event/group-learning',
  }, {
    label: 'E-Library',
    href: '/main/e-library',
  // }, {
  //   label: 'Event',
  //   href: '/main/training-event/event',
  }]
}, {
  label: 'Library',
  logo: '/icons/light/icon-sidebar-library.svg',
  logoActive: '/icons/light/icon-sidebar-library.svg',
  items: [{
    label: 'Knowledge & Training',
    href: '/main/library/knowledge-training',
  }, {
    label: 'Competency Dictionary',
    href: '/main/library/competency-dictionary',
  }, {
    label: 'Pre-Made OKRs',
    href: '/main/library/pre-made-okrs',
  }]
}, {
  label: 'Training & Budget',
  logo: '/icons/light/icon-sidebar-training-budget.svg',
  logoActive: '/icons/light/icon-sidebar-training-budget.svg',
  items: [{
    label: 'Budgeting',
    href: '/main/training-budget/budgeting',
  }, {
    label: 'Plan & Budget Final',
    href: '/main/training-budget/plan-budget-final',
  }, {
    label: 'Realisasi',
    href: '/main/training-budget/realisasi',
  }]
}, {
  label: 'ROTI',
  logo: '/icons/light/icon-sidebar-roti.svg',
  logoActive: '/icons/light/icon-sidebar-roti.svg',
  items: [{
    label: 'Detail ROTI',
    href: '/main/roti',
  }]
}];