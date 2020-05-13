import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { Table, Select } from "antd";
import {
  Wrapper,
  StyledButton,
  StyledForm,
  StyledItem,
  StyledH2,
} from "../styles/form";
const { Option } = Select;
function StockSummary() {
  const [itemList, setItemList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);

  const [form] = StyledForm.useForm();
  const [displayItemId, setDisplayItemId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const itemsRecords = await firestore().collection("items").get();

      const tempItemList = [];

      for (const doc of itemsRecords.docs) {
        tempItemList.push(doc.data());
      }

      console.log("Get ItemList", tempItemList);

      setItemList(tempItemList);
    };

    fetchData();
  }, []);

  const columns = [
    // { title: "Id", dataIndex: "id", key: "id" },

    {
      title: "ItemName",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "PurchaseQuantity",
      dataIndex: "purchaseQuantity",
      key: "purchaseQuantity",
    },
    {
      title: "SalesQuantity",
      dataIndex: "salesQuantity",
      key: "salesQuantity",
    },
    {
      title: "ClosingStock",
      dataIndex: "",
      key: "",
      render: (itemList) => itemList.purchaseQuantity - itemList.salesQuantity,
    },
  ];
  const onFinish = async (values) => {
    console.log("the value is", values);
    let type;
    if (values.type === "salesQuantity") {
      type = "salesQuantity";
      console.log("The type is:", type);
    } else {
      type = "purchaseQuantity";
      console.log("The type is:", type);
    }

    const fetchData = async () => {
      const transactionsRecords = await firestore()
        .collection("transactions")
        .where("itemId", "==", values.itemId)
        .where(type, ">", 0)
        .get();

      const tempItemList = [];

      for (const doc of transactionsRecords.docs) {
        tempItemList.push(doc.data());
      }

      console.log("Get transactionList", tempItemList);

      setTransactionList(tempItemList);
    };
    fetchData();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Wrapper>
        <StyledH2>StockSummary</StyledH2>
        <StyledForm
          name="basic"
          initialValues={{
            itemId: "",
            type: "",
          }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <StyledItem label="Item" rules={[{ required: true }]} name="itemId">
            <Select
              placeholder="Select a option"
              onChange={(itemId) => setDisplayItemId(itemId)}
            >
              {itemList.map((itemObj) => {
                return <Option value={itemObj.id}>{itemObj.itemName}</Option>;
              })}
            </Select>
          </StyledItem>

          <StyledItem label="Type" rules={[{ required: true }]} name="type">
            <Select placeholder="Select a option">
              <Option value="salesQuantity">Sales</Option>
              <Option value="purchaseQuantity">Purchase</Option>;
            </Select>
          </StyledItem>

          <StyledItem label="Opening Stock">{itemList.openingStock}</StyledItem>

          <StyledItem>
            <StyledButton type="primary" htmlType="submit">
              Search
            </StyledButton>
          </StyledItem>
        </StyledForm>

        <Table columns={columns} dataSource={transactionList} />
      </Wrapper>
    </div>
  );
}

export default StockSummary;
