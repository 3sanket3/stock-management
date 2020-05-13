import React from "react";
import { Input } from "antd";
import { firestore } from "firebase";
import {
  Wrapper,
  StyledButton,
  StyledForm,
  StyledItem,
  StyledH2,
} from "../styles/form";
import { useHistory } from "react-router-dom";

function AddNewItem() {
  const [form] = StyledForm.useForm();
  let history = useHistory();
  const onFinish = async (values) => {
    console.log("the value", values);
    try {
      const doc = firestore().collection("items").doc();
      // console.log(doc.id);
      const docData = {
        ...values,
        id: doc.id,
        openingStock: +values.openingStock,
      };
      console.log("the docData", docData);
      await doc.set(docData);
      history.push("/");
    } catch (e) {
      console.log(e);
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
          openingStock: 0,
        }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <StyledH2>Add New Item </StyledH2>

        <StyledItem
          name="itemName"
          rules={[{ required: true, message: "Please input your ItemName!" }]}
        >
          <Input placeholder="Item Name" autoComplete="off" />
        </StyledItem>

        <StyledItem
          name="openingStock"
          rules={[
            { pattern: new RegExp(/^[0-9]*$/), message: "Not a valid number!" },
          ]}
        >
          <Input placeholder="Opening Stock" autoComplete="off" />
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

export default AddNewItem;
