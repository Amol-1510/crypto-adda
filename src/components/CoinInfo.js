import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { createTheme } from '@mui/material';
import { CircularProgress } from '@material-ui/core';
import { Line } from "react-chartjs-2";
import { chartDays } from "../config/data";
import SelectButton from './SelectButton';
import { ThemeProvider } from '@mui/material/styles';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const CoinInfo = ({coin}) => {
  const [hisData,setHisData] = useState();
  const [days,setDays] = useState(1);
  const [flag,setflag] = useState(false);

  const { curr} = CryptoState();

  const fetchHisData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id,days,curr));
    setflag(true);
    setHisData(data.prices);
  }

  useEffect(()=>{
    fetchHisData();
  },[curr,days]);

  const darkTheme = createTheme({
    palette: {
      primary:{
        main: "#fff",
      },
      mode: "dark",
    },
  })

  

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="container"
      style={{
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [darkTheme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    }}>
        {!hisData | flag===false ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: hisData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: hisData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${curr}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {setDays(day.value);
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

export default CoinInfo