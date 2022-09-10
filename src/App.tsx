import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Select,
} from "@chakra-ui/react";
import SimpleTable from "./components/SimpleTable";
import { SearchIcon } from "@chakra-ui/icons";
import { FaFileUpload, FaFileExport } from "react-icons/fa";
import axios from "axios";

const data = [
  {
    title: "Beautiful cooking",
    isbn: "5454-5587-3210",
    author: "null-walter@echocat.org",
    date: "21.05.2011",
  },
  {
    title: "Deautiful cooking",
    isbn: "5454-5587-3210",
    author: "null-walter@echocat.org",
    date: "21.05.2011",
  },
  {
    title: "Aeautiful cooking",
    isbn: "5454-5587-3210",
    author: "null-walter@echocat.org",
    date: "21.05.2011",
  },
  {
    title: "Zeautiful cooking",
    isbn: "5454-5587-3210",
    author: "null-walter@echocat.org",
    date: "21.05.2011",
  },
  {
    title: "Peautiful cooking",
    isbn: "5454-5587-3210",
    author: "null-walter@echocat.org",
    date: "21.05.2011",
  },
];

function App() {
  const inputRef: any = useRef();
  const [file, setFile] = useState<any>();
  const [category, setCategory] = useState<any>("isbn");
  const [searchValue, setSearchValue] = useState<any>("");
  const [libraryData, setLibraryData] = useState(data);
  const [sortedBy, setSortedBy] = useState<any>(null);

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      e.target.files[0].text().then((data: any) => {
        const parsedData = parseFileData(data);
        console.log(parsedData);
        // uploadFileData(parsedData);
      });
    }
    e.target.value = "";
  };

  function parseFileData(file: any) {
    const rows = file.split("\r\n");
    let data = [];
    console.log(rows);
    for (let i = 1; i < rows.length; i++) {
      data.push(rows[i].split(","));
    }
    console.log(data);
    return { header: rows[0].split(","), data: data };
  }

  async function uploadFileData(data: any) {
    const res = await axios.post(
      `http://${process.env.REACT_APP_BACKEND_URL}/api/filedata`,
      data
    );
  }

  const handleSearchChange = (e: any) => {
    console.log(e.target.value);
    setSearchValue(e.target.value);
  };

  const handleSelectChange = (e: any) => {
    console.log(e.target.value);
    setCategory(e.target.value);
  };

  const sortByName = () => {
    libraryData.sort(function (a: any, b: any) {
      let x = a.title.toLowerCase();
      let y = b.title.toLowerCase();
      if (x > y) {
        return sortedBy === "asc" ? -1 : 1;
      }
      if (x < y) {
        return sortedBy === "asc" ? 1 : -1;
      }
      return 0;
    });
    if (sortedBy) {
      sortedBy === "asc" ? setSortedBy("desc") : setSortedBy("asc");
    } else {
      setSortedBy("asc");
    }
  };

  const handleExportClick = () => {
    let rows = [];
    rows.push(Object.keys(libraryData[0]).join(","));
    libraryData.map((d: any) => {
      rows.push(Object.values(d).join(","));
    });
    const text = rows.join("\r\n");
    var blob = new Blob([text], { type: "text/csv" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  return (
    <div>
      <Box p={4}>
        <Stack mb={6} pb={4} borderBottom={"2px"} borderColor="gray.200">
          <Flex justify={"space-between"} align="center">
            <Box>
              <Heading>Library</Heading>
              <Text mb={4}>
                The collection of books and magazines by top authors.
              </Text>
            </Box>
            <Stack direction={"row"}>
              <Button
                rightIcon={<FaFileExport />}
                colorScheme="blue"
                variant="outline"
                onClick={handleExportClick}
              >
                Export To CSV
              </Button>
              <Button
                rightIcon={<FaFileUpload />}
                colorScheme="blue"
                variant="outline"
                onClick={() => inputRef.current.click()}
              >
                <input
                  type={"file"}
                  hidden
                  ref={inputRef}
                  onChange={handleFileChange}
                />
                Upload File
              </Button>
            </Stack>
          </Flex>
          <Flex gap={"2"}>
            <InputGroup>
              <Input
                placeholder="Search"
                onChange={handleSearchChange}
                value={searchValue}
              />
              <InputRightElement children={<SearchIcon color={"gray.300"} />} />
            </InputGroup>
            <Select
              w={"container.sm"}
              variant="outline"
              value={category}
              onChange={handleSelectChange}
            >
              <option value="isbn">ISBN</option>
              <option value="author">Author</option>
            </Select>
          </Flex>
        </Stack>
        <SimpleTable
          data={libraryData}
          sortByName={sortByName}
          sortedBy={sortedBy}
        />
      </Box>
    </div>
  );
}

export default App;
