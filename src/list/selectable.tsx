import * as React from 'react';
import {observable, computed} from 'mobx';
import * as classNames from 'classnames';
import {ListBase} from './base';
import {uid} from '../uid';

export interface SelectableItem {
    selected: boolean;
    item: any;
    labelId: string;
}

export class Selectable extends ListBase {
    private _items: SelectableItem[];
    private _selectedItems: any[];
    private input: HTMLInputElement;
    private buildItems() {
        let {items, selectedItems, compare} = this.list.props;
        if (items === undefined) {
            return this._items = undefined;
        }
        this._selectedItems = selectedItems;
        if (selectedItems === undefined) {
            return this._items = items.map(v => {
                return {
                    selected:false, 
                    item:v, 
                    labelId:uid()
                };
            });
        }
        if (compare === undefined) {
            return this._items = items.map(v => {
                return {
                    selected:selectedItems.find(si => si === v) !== undefined, 
                    item:v, 
                    labelId:uid()
                };
            });
        }
        return this._items = items.map(v => {
            return {
                selected:selectedItems.find(si => compare(v, si)) !== undefined, 
                item:v, 
                labelId:uid()
            };
        });
    }
    @computed get items() {
        if (this._items === undefined) this.buildItems();
        return this._items;
    }
    updateProps(nextProps:any) {
        if (nextProps.selectedItems === this._selectedItems) return;
        this.buildItems();
    }
    private onSelect(item:SelectableItem, selected:boolean) {
        item.selected = selected;
        let anySelected = this._items.some(v => v.selected);
        this.list.props.item.onSelect(item.item, selected, anySelected);
    }
    
    get selectedItems():any[] {
        return this._items.filter(v => v.selected === true).map(v => v.item);
    }
    /*
    set selectedItems(value: any[]) {
        if (value === undefined) return;
        if (this._items === undefined) return;
        let sLen = this._items.length;
        let list = value.slice();
        for (let n=0; n<sLen; n++) {
            let sItem = this._items[n];
            let len = list.length;
            if (len === 0) break;
            let item = sItem.item;
            for (let i=0; i<len; i++) {
                let v = list[i];
                if (item === v) {
                    sItem.selected = true;
                    value.splice(i, 1);
                    break;
                }
            }
        };
    }
    */
    //w-100 mb-0 pl-3
    //m-0 w-100
    render(item:SelectableItem, index:number):JSX.Element {
        let {className, render, onSelect} = this.list.props.item;
        let {labelId, selected} = item;
        return <li key={index} className={classNames(className)}>
            <div className="d-flex align-items-center px-3">
                <input ref={input=>{
                        if (!input) return;
                        this.input = input; input.checked = selected;
                    }}
                    className="" type="checkbox" value="" id={labelId}
                    defaultChecked={selected}
                    onChange={(e)=>{
                        this.onSelect(item, e.target.checked)} 
                    }/>
                <label className="" style={{flex:1}} htmlFor={labelId}>
                    {this.renderContent(item.item, index)}
                </label>
            </div>
        </li>
    }
}
/*
<label>
<label className="custom-control custom-checkbox">
    <input type='checkbox' className="custom-control-input"
        //checked={selected}
        onChange={(e)=>this.onSelect(item, e.target.checked)} />
    <span className="custom-control-indicator" />
</label>
{this.renderContent(item.item, index)}
</label>
*/
