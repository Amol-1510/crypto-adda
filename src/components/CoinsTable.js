import React, { useEffect, useState } from 'react'
import { CryptoState } from '../CryptoContext';
import axios from 'axios';
import { CoinList } from '../config/api';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { LinearProgress, TableContainer, TextField, Typography, createTheme, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import { numberWithCommas } from './Banner/Carousel';


const CoinsTable = () => {
  const [coins,setCoins] = useState([]);
  const[loading,setLoading] = useState(false);
  const [search,setSearch] = useState("");
  const [page,setPage] = useState(1);

  const { curr, symbol } = CryptoState();
  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination : {
      "& .MuiPaginationItem-root":{
        color: "gold"
      }
    }
  })
  const classes = useStyles();

  
  useEffect(()=>{
    const fetchCoins = async () => {
      setLoading(true);
      const { data } = await axios.get(CoinList(curr));
      setCoins(data);
      setLoading(false);
    };
    fetchCoins();
  },[curr]);

  const darkTheme = createTheme({
    palette: {
      primary:{
        main: "#fff",
      },
      type: "dark",
    },
  })

  const navigate = useNavigate();

  const handleSearch = () => {
    return coins.filter((coin) => (
     coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase())
    ))
  }

  console.log(handleSearch());

  

  return (
    <ThemeProvider theme={darkTheme}>
    <Container style={{textAlign : "center"}}>
    <Typography variant="h4" style={{margin : 18, fontFamily : "Montserrat"}}>
    Cryptocurrency prices by market cap
    <TextField label="Search for a Crypto Currency..." 
    variant="outlined" 
    style={{margin : 20, width: "100%",}}
    onChange={(e)=>{
      setSearch(e.target.value) 
    }}  
    />
    
    </Typography>
    <TableContainer>
      {
        loading ? (
          <LinearProgress style={{backgroundColor: "gold"}} />
        ) : (
          <Table>
            <TableHead style={{backgroundColor : "#EEBC1D"}}>
            <TableRow>
              {["Coin" , "Price" , "24Hrs Change" , "Market Cap"].map((head)=>(

                <TableCell style={{
                  color: "black",
                  fontWeight: "700",
                  fontFamily: "Montserrat",
                }}
                key={head}
                align={head === "Coin" ? "left" : "right"}
                >
                  {head}
                </TableCell>
        ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {
              handleSearch().slice((page-1)*10,(page-1)*10+10)
              .map((row) => {
                const profit = row.price_change_percentage_24h > 0;
                return (
                <TableRow onClick={()=>{
                  navigate(`/coins/${row.id}`)
                }}
                className={classes.row}
                key={row.name}
                >
                <TableCell component='th' scope='row'
                style={{diaplay : "flex", gap: 15,}}>
               
                <img
                    src={row?.image}
                    alt={row.name}
                    height="50"
                    style={{ marginBottom: 10,float: "left", marginRight: "20px" }}
                />
                <div
                style={{ display: "flex", flexDirection: "column",  }}
                >
                <span style={{textTransform: "uppercase", fontSize: 22, color: "white"}}>
                {row.symbol}
                </span>
                <span style={{ color: "darkgrey" }}>
                {row.name}
                </span>
                </div>
                </TableCell>
                <TableCell align="right" style={{color: "white"}}>
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right" style={{color: "white"}}>
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                </TableRow>
              )
              })
            }

            </TableBody>
          </Table>
        )
      }
    </TableContainer>
    <Pagination 
    style={{
      padding: "20px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      color:"gold"
    }}
    classes={{ul : classes.pagination}}
    count={(handleSearch()?.length / 10).toFixed(0)}
    onChange={
      (_,value) => {
        setPage(value);
        window.scroll(0,550);
      }
    }
    />
    </Container>
    </ThemeProvider>
    
  )
}

export default CoinsTable;  