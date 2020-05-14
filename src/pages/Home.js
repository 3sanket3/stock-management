import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
function Home() {
  const Wrapper = styled.div`
    padding-right: 20px;
    padding-left: 30px;
    margin-top: 20px;
    border: 2px solid black;
    margin-right: 30%;
    margin-left: 30%;
  `;
  const StyledLink = styled(Link)`
    margin-left: 80px;
    margin-right: 80px;
    margin-top: 20px;
    border-radius: 5px;
  `;
  return (
    <Wrapper>
      <StyledLink to={"/home/add-new-item"}>
        <div>
          <button type="button">AddNewItem</button>
        </div>
      </StyledLink>
      <StyledLink to={"/home/purchase"}>
        <div>
          <button type="button">Purchase</button>
        </div>
      </StyledLink>
      <StyledLink to={"/home/sales"}>
        <div>
          <button type="button">Sales</button>
        </div>
      </StyledLink>
      <StyledLink to={"/home/stock-summary"}>
        <div>
          <button type="button">Stock Summary</button>
        </div>
      </StyledLink>
      <StyledLink to={"/home/transactions"}>
        <div>
          <button type="button">Transactions</button>
        </div>
      </StyledLink>
    </Wrapper>
  );
}

export default Home;
