import React, { useEffect, useState } from "react";
import XIcon from "@mui/icons-material/X";
import style from "./style.module.css";
import { getTweets } from "../../../api";

const TweetSection = () => {
  const [tweets, setTweets] = useState();

  const getTweetsData = async () => {
    try {
      const response = await getTweets();
      if (response.status === 200) {
        const value = await response.json();
        setTweets(value?.tweets);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTweetText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to detect URLs starting with http/https
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    getTweetsData();
  }, []);

  return (
    <div className={style.tweetContent}>
      {tweets &&
        tweets.length > 0 &&
        tweets.map((item) => (
          <div key={item.id} className={style.tweetSection}>
            <div>
              <strong>
                {" "}
                <XIcon />{" "}
              </strong>{" "}
              <br /> {formatTweetText(item.tweet)}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TweetSection;
