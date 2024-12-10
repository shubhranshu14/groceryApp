import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/cartStyle.css";
import "../styles/productListStyle.css";
import "../styles/orderListStyle.css";

import { useNavigate } from "react-router-dom";

import TopBar from "../components/topBar";
import { getOrderByUser } from "../api/product";
import { Button, Card, CardContent, Divider, Skeleton, Typography } from "@mui/material";
import { useCart } from "../context/cartContext";
import { orderBy } from "lodash";
import { useUser } from "../context/userContext";


function DeliveredLabel() {
    return (
        <div style={{ color: '#37aa25', backgroundColor: '#daffbd', border: '1px solid #37aa25', padding: '2px', borderRadius: '4px' }}>
            <p style={{ fontSize: '10px', fontWeight: 'bold' }}>DELIVERED</p>
        </div>
    )
}

const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

function UserOrderScreen() {


    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const { setCart } = useCart();
    const [loading, setLoading] = useState(false);

    const authToken = localStorage.getItem('authToken');

    const getMyOrder = async () => {
        setLoading(true);
        try {
            const res = await getOrderByUser(authToken);
            if (!res.success) {
                throw new Error(res.message);
            }
            setLoading(false);
            const sortedData = sortData(res.data);
            setOrderList(sortedData);

        } catch (error) {

        }
    }

    useEffect(() => {
        getMyOrder();
    }, []);

    const handleReorder = (orderData) => {
        setCart(orderData);
        navigate('/cart');
    }



    return (
        <div className="divContainer">
            <TopBar backNavigateTo="home" screenName="My Orders" hideCartBtn={true} />

            {loading ?
                <div className="innerOrderContainer">
                    {
                        Array(4).fill().map((_, idx) => (
                            <Card key={idx} sx={{ minHeight: "200px", p: 2, marginBottom: '20px' }}>

                                <Typography gutterBottom variant="caption">
                                    <Skeleton />
                                </Typography>
                                <Typography gutterBottom variant="caption">
                                    <Skeleton sx={{ width: "40%" }} />
                                </Typography>
                                <Divider sx={{ margin: '10px 0' }} />
                                <Typography gutterBottom variant="caption">
                                    <Skeleton />
                                </Typography>
                                <Typography gutterBottom variant="caption">
                                    <Skeleton />
                                </Typography>
                                <Divider sx={{ margin: '10px 0' }} />
                                <div className="flex js_bw al_ctr" >
                                    <Typography variant="caption" >
                                        <Skeleton sx={{ width: "80px" }} />
                                    </Typography>

                                    <Typography variant="h3" >
                                        <Skeleton sx={{ width: "80px" }} />
                                    </Typography>

                                </div>



                            </Card>
                        ))
                    }
                </div>
                : orderList.length == 0 ?
                    (
                        <div className="noOrderHolder flex js_ctr al_ctr">
                            <img src="/images/noOrder.png" />
                            <h2>No delivery orders yet</h2>
                        </div>
                    ) :
                    (<div className="innerOrderContainer">
                        {
                            orderList.map((order) => (

                                <Card key={order._id} sx={{ marginBottom: '20px' }}>
                                    <CardContent>
                                        <div className="flex js_bw al_ctr">
                                            <Typography gutterBottom sx={{ fontSize: 12 }}>
                                                Order # {order._id}
                                            </Typography>
                                            <DeliveredLabel />
                                        </div>
                                        <Typography gutterBottom sx={{ fontSize: 10 }}>
                                            {formatDate(order.createdAt)}
                                        </Typography>
                                        <Divider sx={{ margin: '10px 0' }} />
                                        {
                                            order.orderData.map((item, idx) => (
                                                <div key={idx} className="flex js_bw al_ctr">
                                                    <Typography gutterBottom sx={{ fontSize: 12 }}>
                                                        {item.itemName} {!item.looseItem ? `(${item.selectedSize})` : null}
                                                    </Typography>
                                                    <Typography gutterBottom sx={{ fontSize: 12 }}>
                                                        {item.looseItem ? item.selectedSize : item.quantity}
                                                    </Typography>
                                                </div>

                                            ))
                                        }

                                        <Divider sx={{ margin: '10px 0' }} />

                                        <div className="flex js_bw al_ctr">
                                            <Typography gutterBottom sx={{ fontSize: 14, fontWeight: 'bold' }}>
                                                ₹{order.totalPrice}
                                            </Typography>
                                            <Button variant="contained" size="small" color="success" onClick={() => handleReorder(order.orderData)}>Reorder</Button>
                                        </div>

                                    </CardContent>
                                </Card>

                            ))
                        }
                    </div>)

            }




        </div>
    );
}

export default UserOrderScreen;

const sortData = (data) => {

    return orderBy(data, ['createdAt'], ['d']);
}