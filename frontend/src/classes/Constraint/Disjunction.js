import {GroupConstraintItem} from "@/classes/Constraint/GroupConstraintItem";

export class Disjunction extends GroupConstraintItem {
    constructor(items) {
        super(items, '∨', 'or', 'disj');
    }

    toStringPostfix() {
        return this.items
            .map((item) => item.toStringPostfix())
            .join(` `) + ' Disjunction';
    }
}
