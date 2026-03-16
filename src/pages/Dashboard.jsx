import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardWidget from "../components/DashboardWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState("");
  const [activeUsers, setActiveUsers] = useState("");
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const usersCollection = collection(db, "userDetails");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      setTotalUsers(userList.length);

      const activeUserCount = userList.filter((user) => user.isActive).length;
      setActiveUsers(activeUserCount);

      // Simulate fetching user stats over time
      const stats = userList.map((user, index) => ({
        name: `User ${index + 1}`,
        total: index + 1,
        active: user.isActive ? 1 : 0,
      }));

      setUserStats(stats);
    };

    fetchUserData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setActiveUsers((prevCount) => prevCount + 1);
      } else {
        setActiveUsers((prevCount) => prevCount - 1);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="widgets-container">
        <DashboardWidget title="Total Users" value={totalUsers.toString()} />
        <DashboardWidget title="Active Users" value={activeUsers.toString()} />
        <DashboardWidget title="New Signups" value="-" />
      </div>
      <div className="charts-container">
        <div className="chart">
          <h3>Total Users Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h3>Active Users Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
