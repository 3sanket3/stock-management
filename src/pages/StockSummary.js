import React, {useEffect, useState} from "react";
import {firestore} from "firebase";
import {Table, Select, Button} from "antd";
import {
  Wrapper,
  StyledH2,
  StyledButton,
  StyledForm,
  StyledItem,
} from "../styles/form";
const {Option} = Select;

function StockSummary() {
  const [itemList, setItemList] = useState([]);
  const [tableItemList, setTableItemList] = useState([]);
  const [form] = StyledForm.useForm();
  const [isDeleting, setDeleing] = useState(false);
  //testing
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("items")
      .onSnapshot((itemRecords) => {
        const tempItemList = [];

        for (const doc of itemRecords.docs) {
          tempItemList.push(doc.data());
        }

        console.log("Get ItemList", tempItemList);

        setItemList(
          tempItemList.sort((first, second) =>
            first.itemName < second.itemName ? -1 : 1
          )
        );
        setTableItemList(
          tempItemList.sort((first, second) =>
            first.itemName < second.itemName ? -1 : 1
          )
        );
      });

    return () => unsubscribe();
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
    {
      title: "Delete",
      key: "delete",
      render: (text, record) => (
        <Button
          danger
          onClick={async () => {
            if (
              window.confirm(
                `Are you sure to delete "${record.itemName}"? This process is irreversible.`
              )
            ) {
              try {
                setDeleing(true);

                await firestore().collection("items").doc(record.id).delete();
                const records = await firestore()
                  .collection("transactions")
                  .where("itemId", "==", record.id)
                  .get();
                for (const doc of records.docs) {
                  await doc.ref.delete();
                }
              } catch (e) {
                alert(`Error occured while deleting ${record.itemName}`);
              } finally {
                setDeleing(false);
              }
            }
            console.log("left pop up");
          }}
        >
          {" "}
          Delete
        </Button>
      ),
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
          <StyledItem label="Item" rules={[{required: true}]} name="itemId">
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

        {isDeleting ? <h3>Deleting item...</h3> : null}
        <Table columns={columns} dataSource={tableItemList} />
      </Wrapper>
    </div>
  );
}

export default StockSummary;
