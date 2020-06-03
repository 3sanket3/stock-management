import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { Table, Select, Popconfirm, message } from "antd";
import {
  Wrapper,
  StyledButton,
  StyledForm,
  StyledItem,
  StyledH2,
} from "../styles/form";
import { Link } from "react-router-dom";
const { Option } = Select;

function Transactions() {
  const [itemList, setItemList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);

  const [form] = StyledForm.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await firestore()
        .collection("items")
        .onSnapshot((itemsRecords) => {
          const tempItemList = [];

          for (const doc of itemsRecords.docs) {
            tempItemList.push(doc.data());
          }

          console.log("Get ItemList", tempItemList);

          setItemList(
            tempItemList.sort((first, second) =>
              first.itemName < second.itemName ? -1 : 1
            )
          );
        });
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  async function DeleteTransaction(transactionId) {
    console.log("transactionId", transactionId);
    try {
      const deletedRecords = await firestore()
        .collection("transactions")
        .doc(transactionId)
        .delete();

      const filterRecord = transactionList.filter(
        (item) => item.id !== transactionId
      );
      console.log("Filter Record", filterRecord);
      setTransactionList(filterRecord);
      message.success("The successfully Delete the transaction");
    } catch (e) {
      console.log("the error is", e);
    }
  }

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
    {
      title: "Action",
      key: "action",
      render: (transactionInfo) => (
        <Popconfirm
          title="Are you sure delete this task?"
          onConfirm={() => DeleteTransaction(transactionInfo.id)}
          okText="Yes"
          cancelText="No"
        >
          <Link to="">Delete</Link>
        </Popconfirm>
      ),
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
        <StyledH2>Transactions</StyledH2>
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
            <Select placeholder="Select a option">
              {itemList.map((itemObj) => {
                return (
                  <Option value={itemObj.id} key={itemObj.id}>
                    {itemObj.itemName}
                  </Option>
                );
              })}
            </Select>
          </StyledItem>

          <StyledItem label="Type" rules={[{ required: true }]} name="type">
            <Select placeholder="Select a option">
              <Option value="salesQuantity" key="Sales">
                Sales
              </Option>
              <Option value="purchaseQuantity" key="Purchase">
                Purchase
              </Option>
              ;
            </Select>
          </StyledItem>

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

export default Transactions;
