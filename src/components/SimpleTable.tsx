import React from "react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  chakra,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

export default function SimpleTable(props: IProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead borderBottom={"1px solid"} borderColor={"gray.500"}>
          <Tr>
            <Th onClick={props.sortByName}>
              Title
              {props.sortedBy && (
                <chakra.span pl={4}>
                  {props.sortedBy === "asc" ? (
                    <TriangleDownIcon />
                  ) : (
                    <TriangleUpIcon />
                  )}
                </chakra.span>
              )}
            </Th>
            <Th>ISBN</Th>
            <Th>Author</Th>
            <Th>Category</Th>
          </Tr>
        </Thead>
        <Tbody data-testid="body">
          {props.data?.map((row: ILibraryData, rowIndex: number) => {
            return (
              <Tr _hover={{ bg: `blue.100` }} key={rowIndex}>
                <Td>{row.title}</Td>
                <Td>{row.isbn}</Td>
                <Td>{row.author}</Td>
                <Td>{row?.category}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
interface IProps {
  data: ILibraryData[] | undefined;
  sortByName: () => void;
  sortedBy: ISortedBy;
}

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
