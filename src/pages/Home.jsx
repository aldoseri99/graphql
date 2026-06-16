import { Transaction } from "../components/Transaction.jsx";
import { Progress } from "../components/Progress.jsx";
import { ProfileCard } from "../components/ProfileCard.jsx";
import { useEffect, useState } from "react";
import { LevelStats } from "../components/Level.jsx";
import { SplashScreen } from "../components/SplashScreen.jsx";

export const Home = ({ token }) => {
  const [postLoginSplash, setPostLoginSplash] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("postLoginSplash");
    if (flag === "1") {
      setPostLoginSplash(true);

      const timer = setTimeout(() => {
        setPostLoginSplash(false);
        sessionStorage.removeItem("postLoginSplash");
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  sessionStorage.setItem("projectSplash", "1");
  sessionStorage.setItem("profilSplash", "1");

  const [data, setData] = useState([]);
  useEffect(() => {
    if (!token) return;
    setData(null);
    fetchData(token);
  }, [token]);

  const fetchData = async (token) => {
    const res = await fetch(
      "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{ user { id login email attrs createdAt updatedAt }
          transaction { id type amount userId attrs createdAt path objectId eventId campus object{name}}
          progress { id  createdAt  grade  isDone eventId  objectId  object{ name type } event { id }  }
          object_child(where:{parentId:{_eq :3312}}){ id parentId childId key attrs}}`,
        }),
      },
    );
    const json = await res.json();
    setData(json.data);
  };

  return (
    <>
      {postLoginSplash && <SplashScreen splashText="Devour Feculence" />}
      {token ? (
        <>
          <div className="Home">
            {data && data.user && data.transaction ? (
              <>
                <ProfileCard user={data.user[0]} prog={data.progress} />
                <LevelStats transaction={data.transaction} />
                <Progress progress={data.progress} />
                <Transaction transaction={data.transaction}/>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
