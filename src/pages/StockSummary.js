import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { Table, Select } from "antd";
import {
  Wrapper,
  StyledH2,
  StyledButton,
  StyledForm,
  StyledItem,
} from "../styles/form";
const { Option } = Select;

function StockSummary() {
  const [itemList, setItemList] = useState([]);
  const [tableItemList, setTableItemList] = useState([]);
  const [form] = StyledForm.useForm();
  //testing
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
          setTableItemList(tempItemList);
        });
      return () => unsubscribe();
    };

    return fetchData();
  }, []);

  const onFinish = async (values) => {
    console.log("the value is", values);

    const searchItemRecord = await firestore()
      .collection("items")
      .doc(values.itemId)
      .get();

    console.log("Search ItemRecord", searchItemRecord.data());

    const tempVariable = [];

    tempVariable.push(searchItemRecord.data());

    setTableItemList(tempVariable);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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

          <StyledItem>
            <StyledButton type="primary" htmlType="submit">
              Search
            </StyledButton>
          </StyledItem>
        </StyledForm>

        <Table columns={columns} dataSource={tableItemList} />
      </Wrapper>
    </div>
  );
}

export default StockSummary;
