import { makeStyles } from '@mui/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TrendingCoins } from '../../config/api';
import { CryptoState } from '../../CryptoContext';
import AliceCarousel from "react-alice-carousel";
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    carousel : {
        height: "50%",
        display: "flex",
       alignItems: "space-around"
    },
    carouselItem: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white",
        fontSize: "5"
      },
})

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

const Carousel = () => {
    const [trending,setTrending] = useState([]);
    const classes = useStyles();

    const {curr,symbol} = CryptoState();

    
    useEffect(()=> {
        const fetchTrendingCoins = async () => { 
            const {data} = await axios.get(TrendingCoins(curr));
            setTrending(data);
        }
        fetchTrendingCoins();
    },[curr]);

    const items = trending.map((coin) => {
        let profit=coin.price_change_percentage_24h >=0
        return (
            <Link className={classes.carouselItem}
            to={`/coins/${coin.id}`}>
            <img 
            src={coin?.image}
            alt={coin.name}
            height="80"
            style={{marginBottom: 10}}    
            />
            <span>
            {coin?.symbol}
            &nbsp;
            <span style={{color: profit>0?"green":"red", fontWeight: "bold"}}>
            {profit && '+'}
            {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
            </span>
            <span style={{fontSize: 15, fontWeight: 500}}>
            {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}

            </span>
            </Link>
        )
    })

    const responsive = {
        0:{
            items : 2,
        },
        512: {
            items : 5,
        }
    }

  return (
    <div className={classes.carousel}>
    <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1000}
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
        disableButtonsControls
    />
    </div>
  )
}

export default Carousel;
export {numberWithCommas};