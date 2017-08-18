/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// to import json file
declare module "*.json" {
  const value: any;
  export default value;
}
