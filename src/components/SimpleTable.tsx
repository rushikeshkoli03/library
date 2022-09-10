import React from "react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  chakra,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

export default function SimpleTable(props: any) {
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
        <Tbody>
          {props.data.map((row: any, rowIndex: any) => {
            return (
              <Tr _hover={{ bg: `blue.100` }} key={rowIndex}>
                <Td>{row.title}</Td>
                <Td>{row.isbn}</Td>
                <Td>{row.author}</Td>
                <Td>{row.date}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
