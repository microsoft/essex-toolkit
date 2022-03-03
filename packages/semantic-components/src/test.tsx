import semantic from './index.js'

const CompA: React.FC<{
	id: string
	className: string
	style: React.CSSProperties
}> = ({ id, className, style }) => {
	return <div id={id} className={className} style={style}></div>
}

const SemanticA = semantic(CompA, {
	className: 'my-class',
	style: { color: 'red' },
})

const SemanticB = semantic.div({ id: 'abc' })

const MyComponent: React.FC = () => {
	return (
		<SemanticB id="123">
			<SemanticA id="x" />
		</SemanticB>
	)
}
