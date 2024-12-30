import '../styles/home.css';
import '../styles/notFoundStyle.css';


function NotFound({ itemSearchedFor }) {
    return (
        <div className="nodataContainer flex js_ctr al_ctr">

            <img id="nodataImg" src="/images/groceryBag.png" />
            {itemSearchedFor ? <h4>Oops! We couldn't find products matching "{itemSearchedFor}"</h4> :
                <h4>No item found</h4>}
        </div>

    )
}

export default NotFound;
