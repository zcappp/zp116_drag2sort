function onInit({ ctx, exc, props, container }) {
    exc('load("https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js")', {}, () => {
        let arr = exc(props.arr, ctx)
        if (!Array.isArray(arr)) return warn("未配置待排序数组")
        let el = props.selector ? $(props.selector) : container.previousElementSibling
        if (!el) return warn("未找到目标容器")
        let O = {
            animation: 150,
            forceFallback: true,
            fallbackTolerance: 5,
            onSort: e => {
                arr.splice(e.newDraggableIndex, 0, arr.splice(e.oldDraggableIndex, 1)[0])
                // exc('render()') // 重新渲染会导致拖放后回弹，如确需重新渲染，使用key表达式/挂载组件重新挂载
            },
            dragClass: props.dragClass || "zp116_dragClass",
            ghostClass: props.ghostClass || "zp116_dropClass"
        }
        if (props.handle) O.handle = props.handle
        if (props.draggable) O.draggable = props.draggable
        if (props.onEnd) O.onEnd = $event => exc(props.onEnd, { ...ctx, $event })
        // if (props.onEnd) O.onEnd = $event => exc(props.onEnd, { ...ctx, $event }, () => exc("render()")) // 重新渲染会导致拖放后回弹
        new Sortable(el, O)
    })
}

const css = `
.zp116_dragClass {
    z-index: 9;
    border: 1px solid #d5d5d5;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, .2), 0 -5px 5px -5px rgba(0, 0, 0, .2);
    background-color: white;
}
.zp116_dropClass {
    background-image: unset !important;
    background-color: gainsboro !important;
    color: gainsboro !important;
}
`

$plugin({
    id: "zp116",
    props: [{
        prop: "arr",
        type: "text",
        label: "待排序数组",
        ph: "$f.x.arr"
    }, {
        prop: "selector",
        type: "text",
        label: "目标容器选择器",
        ph: ".items 默认是前面元素(上一个兄弟节点)"
    }, {
        prop: "handle",
        type: "text",
        label: "手柄选择器",
        ph: "可选"
    }, {
        prop: "draggable",
        type: "text",
        label: "可排序项选择器",
        ph: "可选"
    }, {
        prop: "dragClass",
        type: "text",
        label: "被拽元素类名",
        ph: "默认是 zp116_dragClass"
    }, {
        prop: "ghostClass",
        type: "text",
        label: "目标投放位置类名",
        ph: "默认是 zp116_dropClass"
    }, {
        prop: "onEnd",
        type: "exp",
        label: "onEnd表达式",
        ph: "可选"
    }],
    onInit,
    css
})