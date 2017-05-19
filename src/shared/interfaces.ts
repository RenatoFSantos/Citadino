export interface IMenu {
  title: string;
  component: any;
  icon: string;
  tabComponent?: any;
  typeMenu?:number;
  index?: number;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface ValidationResult {
    [key: string]: boolean;
}

export interface Predicate<T> {
    (item: T): boolean;
}