import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import CardList from "./CardList";
import VideoTutorial from "./VideoTutorial";
import { useState } from "react";
import Typewriter from "typewriter-effect";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function HomePage(props) {
  const [highestRoomId, setHighestRoomId] = useState(null);
  const [trendingRoomList, setTrendingRoomList] = useState([]);
  const mobile = useMediaQuery("(max-width:700px)");

  console.log("Mobile", mobile);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getTrendingRoomList = async () => {
    if (props.contract && props.activeAccount) {
      console.log("Fetching  trending rooms...");
      await props.contract.query
        .getCanvasesByPopularity(props.activeAccount.address, {
          value: 0,
          gasLimit: -1,
        })
        .then((res) => {
          if (!res.result?.toHuman()?.Err) {
            setTrendingRoomList(res.output.toHuman().slice(0, 6));
          } else {
            console.log(
              "Error fetching trending rooms",
              res.result.toHuman().Err
            );
          }
        })
        .catch((err) => {
          console.log("Error while fetching trending rooms", err);
        });
    }
  };

  useEffect(() => {
    const getRoomList = async () => {
      if (props.contract && props.activeAccount) {
        console.log("Fetching Room list");
        await props.contract.query
          .getGameDetails(props.activeAccount.address, {
            value: 0,
            gasLimit: -1,
          })
          .then((res) => {
            if (!res.result.toHuman().Err) {
              console.log("Successfully fetched room list!!");
              console.log(res.output.toHuman());
              setHighestRoomId(parseInt(res.output.toHuman()[1]));
            } else {
              console.log("Error fetching room ", res.result.toHuman().Err);
            }
          })
          .catch((err) => {
            console.log("Error while fetching room list: ", err);
          });
      }
    };
    // getRoomList();
    getTrendingRoomList();
  }, [props.contract, props.activeAccount]);

  useEffect(() => {
    let temp = [];
    for (let i = highestRoomId - 1; i > highestRoomId - 7; i--) {
      if (i >= 0) {
        temp.push(i);
      } else {
        break;
      }
    }
    setTrendingRoomList(temp);
    console.log("Trending room ids: "); // To be removed later
    console.log(temp); //to be removed later
  }, [highestRoomId]);

  return (
    <Box component="div">
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <Box
          component="div"
          sx={{
            fontWeight: "700",
            minHeight: "calc(100vh - 4rem)",
            width: "100vw",
          }}
        >
          <Box
            sx={{
              paddingTop: "60px",
              width: "100%",
              background: "#fcc731",
              minHeight: "330px",
            }}
          >
            <Box sx={{ margin: "auto 0", marginTop: "30px" }}>
              <Typography
                sx={{
                  fontSize: "2em",
                  fontWeight: "bold",
                  width: mobile ? "350px" : "500px",
                  margin: "auto",
                  height: "85.5px",
                }}
              >
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("NFT by the community, for the community.  ")
                      .callFunction(() => {
                        console.log("String typed out!");
                      })
                      .pauseFor(2500)
                      .callFunction(() => {
                        console.log("All strings were deleted");
                      })
                      .changeDelay(2)
                      .start();
                  }}
                  options={{
                    cursorClassName: "typingCursor",
                  }}
                />
              </Typography>
              <Box>
                <Link to="/canvas">
                  <Button
                    variant="contained"
                    disableElevation
                    id="joinRoomButton"
                    sx={{
                      textTransform: "none",
                      width: "152px",
                      height: "55px",
                      borderRadius: "12px",
                      fontSize: "18px",
                      fontWeight: "600",
                      lineHeight: "140%",
                      border: "none",
                      transition: "0.1s ease",
                      backgroundColor: "#111",
                      color: "#fff",
                      cursor: "pointer",
                      marginTop: "30px",
                      marginRight: "30px",
                    }}
                  >
                    Join a Room
                  </Button>
                </Link>
                <Link to="/create">
                  <Button
                    variant="contained"
                    disableElevation
                    id="startRoomButton"
                    sx={{
                      textTransform: "none",
                      width: "152px",
                      height: "55px",
                      borderRadius: "12px",
                      fontSize: "18px",
                      fontWeight: "600",
                      lineHeight: "140%",
                      border: "none",
                      transition: "0.1s ease",
                      backgroundColor: "#0057ff",
                      color: "#fff",
                      cursor: "pointer",
                      marginTop: "30px",
                    }}
                  >
                    Start a Room
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "400",
              fontFamily: "'Fredoka One', cursive",
              marginTop: "30px",
              marginLeft: "5%",
            }}
            align="left"
          >
            Trending Rooms
          </Typography>
          <CardList
            rows={2}
            isMain={true}
            ids={trendingRoomList}
            contract={props.contract}
            activeAccount={props.activeAccount}
          />
          <VideoTutorial />
        </Box>
      </Box>
    </Box>
  );
}
