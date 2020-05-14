import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { Table } from "antd";
import { Wrapper, StyledH2 } from "../styles/form";
function StockSummary() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await firestore()
        .collection("items")
        .onSnapshot((itemRecords) => {
          const tempItemList = [];

          for (const doc of itemRecords.docs) {
            tempItemList.push(doc.data());
          }

          console.log("Get ItemList", tempItemList);

          setItemList(tempItemList);
        });
      return () => unsubscribe();
    };

    return fetchData();
  }, []);

  const columns = [
    // { title: "Id", dataIndex: "id", key: "id" },

    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "Opening Stock",
      dataIndex: "openingStock",
      key: "openingStock",
    },

    {
      title: "ClosingStock",
      dataIndex: "closingStock",
      key: "closingStock",
    },
  ];

  return (
    <div>
      <Wrapper>
        <StyledH2>Stock Summary</StyledH2>

        <Table columns={columns} dataSource={itemList} />
      </Wrapper>
    </div>
  );
}

export default StockSummary;
