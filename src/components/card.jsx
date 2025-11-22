export default function Button({props}){
    return (
        <div className="card-container">
            <div className="card">
                <div className="content">
                    <p>{props.tag}</p>
                    <h1>{props.headline}</h1>
                    <p>{props.tagline}</p>
                </div>
            </div>
        </div>
    )
}