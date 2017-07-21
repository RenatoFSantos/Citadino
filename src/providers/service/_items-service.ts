import { Predicate } from './../../shared/interfaces';
import { Injectable } from '@angular/core';


import lodash from 'lodash';

@Injectable()
export class ItemsService {

    constructor() { }

    getKeys(object): string[] {
        return lodash.keysIn(object);
    }

    reversedItems<T>(array: T[]): T[] {
        return <T[]>lodash.reverse(array);
    }

    groupByBoolean(object, value: boolean): number {
        let result: number = 0;
        if (object == null)
            return result;

        lodash.map(lodash.shuffle(object), function (val) {
            if (val === value)
                result++;
        });

        return result;
    }

    /*    
        Retorna o total dos objeto
    */
    getObjectKeysSize(obj: any): number {
        if (obj == null) {
            return 0;
        } else {
            return lodash.size(obj);
        }
    }

    /*
    Remove um item de uma matriz
    */
    removeItemFromArray<T>(array: Array<T>, item: any) {
        lodash.remove(array, function (current) {
            return JSON.stringify(current) === JSON.stringify(item);
        });
    }

    removeItems<T>(array: Array<T>, predicate: Predicate<T>) {
        lodash.remove(array, predicate);
    }

    includesItem<T>(array: Array<T>, predicate: Predicate<T>) {
        let result = lodash.filter(array, predicate);
        return result.length > 0;
    }

    /*    
        Localiza um item específico em uma matriz usando um predicado e o substitui
    */
    setItem<T>(array: Array<T>, predicate: Predicate<T>, item: T) {
        var _oldItem = lodash.find(array, predicate);
        if (_oldItem) {
            var index = lodash.indexOf(array, _oldItem);
            array.splice(index, 1, item);
        } else {
            array.push(item);
        }
    }

    /*
    Adiciona um item ao índice zero
    */
    addItemToStart<T>(array: Array<T>, item: any) {
        array.splice(0, 0, item);
    }

    /*
     A partir de uma matriz de tipo T, selecione todos os valores de tipo R para propriedade
    */
    getPropertyValues<T, R>(array: Array<T>, property: string): R {
        var result = lodash.map(array, property);
        return <R><any>result;
    }

    /*
    Método Util para serializar uma string para um tipo específico
    */
    getSerialized<T>(arg: any): T {
        return <T>JSON.parse(JSON.stringify(arg));
    }

    /*
        retorna o último elemento
    */
    getLastElement<T>(array: Array<T>): T {
        var result = lodash.last(array);
        return <T><any>result;
    }

       /*
        retorna o primeiro elemento
    */
    getFirstElement<T>(array: Array<T>): T {
        var result = lodash.first(array);
        return <T><any>result;
    }
}