import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";
import logo from "../images/logo.png"; // adjust path if needed
export const ProfileCard = ({ user, prog }) => {
  const navigate = useNavigate();
  // const [user, setUser] = useState('')
  // useEffect(() => {
  //   getUser(token)
  // }, [token])
  // const getUser = async (token) => {
  //   const res = await fetch(
  //     'https://learn.reboot01.com/api/graphql-engine/v1/graphql',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         query: '{ user { id login email createdAt attrs }}'
  //       })
  //     }
  //   )
  //   const json = await res.json()
  //   setUser(json.data.user[0])
  // }

  const profile = () => {
    navigate("/profile");
  };
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age;
  }
  const formatSeveranceName = (firstName = "", lastName = "") => {
    if (!firstName) return "";

    if (!lastName) return firstName;

    // Normalize
    const cleanedLast = lastName.trim().replace(/^al[-\s]?/i, ""); // remove Al / al / Al- / al-

    if (!cleanedLast) return firstName;

    const initial = cleanedLast[0].toUpperCase();

    return `${firstName} ${initial}.`;
  };
  function formatSince(date) {
    if (!date) return "—";
    const d = new Date(date);

    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }
  const since = prog.filter((p) => p?.objectId && p.objectId === 100236);

  return (
    <>
      {user && (
        <div className="home-profile-card" onClick={profile}>
          <div className="profile-info">
            <p className="profile-name">
              {formatSeveranceName(user.attrs.firstName, user.attrs.lastName)}
            </p>

            <p className="profile-username">@{user.login}</p>

            <p className="profile-age">
              Age: {calculateAge(user.attrs.dateOfBirth)}
            </p>

            <p className="profile-role">Macrodata Refinement</p>

            <p className="profile-id">Employee ID • MDR-{user.id}</p>

            <p className="profile-since">
              Employee Since • {formatSince(since[0].createdAt)}
            </p>
          </div>

          <img className="profile-logo" src={logo} alt="Lumon" />
        </div>
      )}
    </>
  );
};
