export default function Review(): JSX.Element {
    console.log(`Region: ${localStorage.getItem('region')}`)
    console.log(`Depth: ${localStorage.getItem('depth')}`)
    console.log(`Staining: ${localStorage.getItem('staining')}`)

    return (
        <div>
            <h1>Hello From Review Page</h1>
        </div>
    )
}