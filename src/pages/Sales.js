import React, { useState, useEffect } from "react";
import { firestore } from "firebase";
import { Select, Input, message } from "antd";
import {
  Wrapper,
  StyledButton,
  StyledForm,
  StyledItem,
  StyledH2,
} from "../styles/form";
import { useHistory, Link } from "react-router-dom";
const { Option } = Select;

function Sales() {
  let history = useHistory();
  const [form] = StyledForm.useForm();
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const itemRecords = await firestore().collection("items").get();

      const tempItemList = [];

      for (const doc of itemRecords.docs) {
        tempItemList.push(doc.data());
      }

      console.log("Get ItemList", tempItemList);

      setItemList(tempItemList);
    };

    fetchData();
  }, []);

  console.log("ItemList", itemList);

  const onFinish = async (values) => {
    console.log("the value is", values);
    const doc = firestore().collection("transactions").doc();

    const itemRecords = itemList.find(({ id }) => id === values.itemName);
    console.log("searchItemRecords", itemRecords);
    if (itemRecords) {
      const docData = {
        ...values,
        id: doc.id,
        salesQuantity: +values.salesQuantity,
        itemName: itemRecords.itemName,
        itemId: itemRecords.id,
        purchaseQuantity: 0,
      };
      console.log("the docData", docData);
      await doc.set(docData);
      message.success("Sales entry added successfully");
      history.push("/");
    } else {
      message.error("Error occurred");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Wrapper>
      <StyledForm
        name="basic"
        initialValues={{
          itemName: "",
          salesQuantity: 0,
        }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <StyledH2>Sales</StyledH2>
        <Link to={"/add-new-item"}>
          <div style={{ marginLeft: "200px" }}>
            <button type="button">AddNewItem</button>
          </div>
        </Link>
        <StyledItem label="Item" rules={[{ required: true }]} name="itemName">
          <Select placeholder="Select a option">
            {itemList.map((itemObj) => {
              return <Option value={itemObj.id}>{itemObj.itemName}</Option>;
            })}
          </Select>
        </StyledItem>

        <StyledItem
          label="SalesQuantity"
          name="salesQuantity"
          rules={[
            {
              required: true,
              pattern: new RegExp(/^[0-9]*$/),
              message: "Not a valid number!",
            },
          ]}
        >
          <Input placeholder="Sales Quantity" autoComplete="off" />
        </StyledItem>

        <StyledItem>
          <StyledButton type="primary" htmlType="submit">
            Submit
          </StyledButton>
        </StyledItem>
      </StyledForm>
    </Wrapper>
  );
}
export default Sales;
