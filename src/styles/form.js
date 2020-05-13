import styled from "styled-components";
import { Form, Button } from "antd";

const { Item } = Form;

const Wrapper = styled.div`
  padding: 0 30%;
  margin: 1em;
`;
const StyledForm = styled(Form)`
  border: 2px solid black;
  margin-bottom: 30px;

  text-align: center;
`;

const StyledItem = styled(Item)`
  margin-left: 80px;
  margin-right: 80px;
  margin-top: 20px;
  border-radius: 5px;
`;
const StyledH2 = styled.h2`
  text-align: center;
  margin-top: 10px;
`;
const StyledButton = styled(Button)`
  // margin-left: 43%;
`;

export { Wrapper, StyledForm, StyledItem, StyledH2, StyledButton };
