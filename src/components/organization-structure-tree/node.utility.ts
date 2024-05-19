export interface OSNodeData {
  id: string
  parent_id?: string
  label: string
  address?: string
  position: string
  photo: string
  pic: string
  children?: OSNodeData[]
  list_job_profile: {
    id?: number
    title: string
  }[]
  head_index?: number
}

export function genNodeID(): string {
  return String(new Date().getTime());
}

export function generateTree(nodes: OSNodeData[], root?: OSNodeData): OSNodeData {
  // root = node without parent id
  const root_node = root ?? nodes.find((node: OSNodeData) => !node.parent_id);

  if (!root_node) {
    throw new Error(`Root node not found`);
  }

  root_node.children = getTreeChildren(root_node, nodes);
  return root_node;
}

function getTreeChildren(parent: OSNodeData, nodes: OSNodeData[]): OSNodeData[] {
  const parent_children = nodes.filter((_node: OSNodeData) => _node.parent_id == parent.id);
  for (const node of parent_children) {
    node.children = getTreeChildren(node, nodes);
  }

  return parent_children;
}

export function flattenTree(tree: OSNodeData): OSNodeData[] {
  return [
    tree,
    ...(tree.children ?? [])
      .map(flattenTree)
      .reduce((acc: OSNodeData[], curr: OSNodeData[]) => [...acc, ...curr], [])
  ];
}

export function dfs(tree: OSNodeData, list_node: OSNodeData[]): OSNodeData[] {
  const result: OSNodeData[] = [];
  const visited: string[] = [];
  const stack: OSNodeData[] = [tree];
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node!);
    if (visited.includes(node!.id)) {
      continue;
    }

    visited.push(node!.id);
    const children = list_node.filter((n: OSNodeData) => n.parent_id == node!.id);
    for (const child of children) {
      stack.push(child);
    }
  }

  return result;
}

export function generateTreeGeneral<T>(
  nodes: T[], 
  getID: (t: T) => any, 
  getParentID: (t: T) => any, 
  setChildrenData: (t: T, lt: T[]) => void, 
  root?: T
): T {
  // root = (node without parent id)
  const root_node = root ?? nodes.find((node: T) => !getParentID(node));

  if (!root_node) {
    throw new Error(`Root node not found`);
  }

  console.log('root', root_node);
  setChildrenData(root_node, getTreeChildrenGeneral<T>(root_node, nodes, getID, getParentID, setChildrenData));
  return root_node;
}

function getTreeChildrenGeneral<T>(parent: T, nodes: T[], getID: (t: T) => any, getParentID: (t: T) => any, setChildrenData: (t: T, lt: T[]) => void): T[] {
  const parent_children = nodes.filter((_node: T) => getParentID(_node) == getID(parent));
  for (const node of parent_children) {
    setChildrenData(node, getTreeChildrenGeneral<T>(node, nodes, getID, getParentID, setChildrenData));
  }

  return parent_children;
}

export function flattenTreeGeneral<T>(
  tree: T, 
  getChildren: (t: T) => T[]
): T[] {
  return [
    tree,
    ...(getChildren(tree) ?? [])
      .map((t: T) => flattenTreeGeneral(t, getChildren))
      .reduce((acc: T[], curr: T[]) => [...acc, ...curr], [])
  ];
}

export function dfsGeneral<T>(
  tree: T | undefined, 
  criteria: (t: T) => boolean, 
  getID: (t: T) => any, 
  getChildren: (t: T) => T[]
): T | undefined {
  if (!tree) {
    return undefined;
  }
  
  const result: T[] = [];
  const visited: string[] = [];
  const stack: T[] = [tree];
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node!);
    if (visited.includes(getID(node!))) {
      continue;
    }

    if (criteria(node!)) {
      return node;
    }
    visited.push(getID(node!));
    for (const child of getChildren(node!)) {
      stack.push(child);
    }
  }

  return undefined;
}


export function iterateDfsGeneral<T>(tree: T, list_node: T[], getID: (t: T) => any, getParentID: (t: T) => any): T[] {
  const result: T[] = [];
  const visited: string[] = [];
  const stack: T[] = [tree];
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node!);
    if (visited.includes(getID(node!))) {
      continue;
    }

    visited.push(getID(node!));
    const children = list_node.filter((n: T) => getParentID(n) == getID(node!));
    for (const child of children) {
      stack.push(child);
    }
  }

  return result;
}
