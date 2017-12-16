/// <reference types="react" />
import { FormView } from '../formView';
import { Field } from '../field';
import { Face, IdPickFace } from '../face';
import { Control } from './control';
export declare class PickIdControl extends Control {
    protected face: IdPickFace;
    protected value: number;
    private element;
    constructor(formView: FormView, field: Field, face: Face);
    private onClick();
    render(): JSX.Element;
}
