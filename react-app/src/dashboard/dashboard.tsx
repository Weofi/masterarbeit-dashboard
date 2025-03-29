import "./dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardProps {
  dataSet?: 1000 | 10_000 | 100_000 | 1_000_000;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: "Male" | "Female" | "Genderqueer";
  avatar: string;
  balance: string;
}

const Dashboard: React.FC<DashboardProps> = ({ dataSet = 1000 }) => {
  const [data, setData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const fetchData = async (size: 1000 | 10_000 | 100_000 | 1_000_000) => {
    let result;
    if (size === 1000) result = await axios.get("/MOCK_DATA.json").then((res) => res.data);
    else if (size === 10_000) result = await axios.get("/MOCK_DATA_10_000.json").then((res) => res.data);
    else if (size === 100_000) result = await axios.get("/MOCK_DATA_100_000.json").then((res) => res.data);
    else if (size === 1_000_000) result = await axios.get("/MOCK_DATA_1_000_000.json").then((res) => res.data);
    setData(result);
  };

  useEffect(() => {
    fetchData(dataSet).then();
  }, [dataSet]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const filtered = data.filter((person) =>
      (person.first_name + person.last_name + person.email + person.gender + person.id)
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase().replace(" ", ""))
    );
    setFilteredData(filtered.slice(0, 100));
  }, [data, debouncedSearchTerm]);

  return (
    <div className="dashboard">
      <input
        type="text"
        className="searchTerm"
        placeholder="search..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredData.map((person) => (
          <li key={person.id}>
            {person.id} {person.last_name} - {person.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
