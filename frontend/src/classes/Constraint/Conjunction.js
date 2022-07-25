import {GroupConstraintItem} from "@/classes/Constraint/GroupConstraintItem";

export class Conjunction extends GroupConstraintItem {
    constructor(items) {
        super(items, '∧', 'and');
    }

    toStringPostfix() {
        return this.items
            .map((item) => item.toStringPostfix())
            .join(` `) + ' Conjunction';
    }

    toStringXML() {
        return `<conj>${
            this.items
                .map((item) => item.toStringXML())
                .join(` `)
        }</conj>`;
    }
}
