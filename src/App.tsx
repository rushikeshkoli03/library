import React, { useRef, useState, useEffect } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ICategory>("author");
  const [searchValue, setSearchValue] = useState<string>("");
  const [libraryData, setLibraryData] = useState<ILibraryData[]>([]);
  const [filteredLibrary, setFilteredLibrary] = useState<ILibraryData[]>([]);
  const [authorData, setAuthorData] = useState<IAuthor[]>();
  const [magazineData, setMagazineData] = useState<IMagazines[]>();
  const [booksData, setBooksData] = useState<IBooks[]>();
  const [sortedBy, setSortedBy] = useState<ISortedBy>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      e.target.files[0].text().then((data: string) => {
        const parsedData = parseFileData(data);
        if (!parsedData.data) return;
        console.log(parsedData);
        if (parsedData.header.includes("publishedAt")) {
          let formattedData: IMagazines[] = [];
          parsedData.data.map((d: any) => {
            formattedData.push({
              title: d[0],
              isbn: d[1],
              author: d[2],
              date: d[3],
            });
          });
          setMagazineData(formattedData);
          setLibraryData((prevState) =>
            prevState.concat(
              [...formattedData].map((d: IMagazines) => ({
                ...d,
                category: "magazine",
              }))
            )
          );
          // setLibraryData([...formattedData.])
        } else if (parsedData.header.includes("lastname")) {
          let formattedData: IAuthor[] = [];
          parsedData.data.map((d: any) => {
            formattedData.push({
              email: d[0],
              firstname: d[1],
              lastname: d[2],
            });
          });
          setAuthorData(formattedData);
        } else if (parsedData.header.includes("description")) {
          let formattedData: IBooks[] = [];
          parsedData.data.map((d: any) => {
            formattedData.push({
              title: d[0],
              isbn: d[1],
              author: d[2],
              description: d[3],
            });
          });
          setBooksData(formattedData);
          setLibraryData((prevState) =>
            prevState.concat(
              [...formattedData].map((d: IBooks) => ({
                ...d,
                category: "book",
              }))
            )
          );
        }
        // uploadFileData(parsedData);
      });
    }
    e.target.value = "";
  };

  function parseFileData(file: string) {
    const rows = file.split("\n");
    let data = [];
    console.log(rows);
    for (let i = 1; i < rows.length - 1; i++) {
      data.push(rows[i].split(";"));
    }
    console.log(data);
    return { header: rows[0].split(";"), data: data };
  }

  async function uploadFileData(data: any) {
    const res = await axios.post(
      `http://${process.env.REACT_APP_BACKEND_URL}/api/filedata`,
      data
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchValue(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "author") setCategory(e.target.value);
    if (e.target.value === "isbn") setCategory(e.target.value);
  };

  const sortByName = () => {
    libraryData?.sort(function (a: ILibraryData, b: ILibraryData) {
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
    if (!libraryData) return;
    rows.push("title;isbn;author;date;description;category");
    libraryData.map((d: ILibraryData) => {
      rows.push(
        `${d.title};${d.isbn};${d.author};${d?.date};${d?.description};${d.category}`
      );
    });
    const text = rows.join("\n");
    console.log(text);
    var blob = new Blob([text], { type: "text/csv" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  useEffect(() => {
    if (searchValue) {
      let reqData;
      if (category === "author") {
        reqData = libraryData.filter((d: ILibraryData) =>
          d.author.includes(searchValue)
        );
      } else {
        reqData = libraryData.filter((d: ILibraryData) =>
          d.isbn.includes(searchValue)
        );
      }
      setFilteredLibrary(reqData);
    }
  }, [searchValue]);

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
                onClick={() => inputRef.current?.click()}
              >
                <input
                  type={"file"}
                  hidden
                  ref={inputRef}
                  onChange={(e) => handleFileChange(e)}
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
              onChange={(e) => handleSelectChange(e)}
            >
              <option value="isbn">ISBN</option>
              <option value="author">Author</option>
            </Select>
          </Flex>
        </Stack>
        <SimpleTable
          data={searchValue ? filteredLibrary : libraryData}
          sortByName={sortByName}
          sortedBy={sortedBy}
        />
      </Box>
    </div>
  );
}

export default App;

interface IAuthor {
  email: string;
  firstname: string;
  lastname: string;
}

interface IBooks {
  title: string;
  isbn: string;
  author: string;
  description?: string;
}

interface IMagazines {
  title: string;
  isbn: string;
  author: string;
  date?: string;
}
type ILibraryData = IBooks & IMagazines & { category?: "book" | "magazine" };

type ICategory = "isbn" | "author";
type ISortedBy = "asc" | "desc" | null;
