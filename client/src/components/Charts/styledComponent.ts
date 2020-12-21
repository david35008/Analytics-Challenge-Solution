import styled from "styled-components";
import { TextField, FormControl } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import { KeyboardDatePicker } from "@material-ui/pickers";

export const PageTitle = styled.div`
  font-size: 40px;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
`;

export const MyFormControl = styled(FormControl)`
  width: 100px;
  margin: 0px 30px;
`;
export const MyFormControlForView = styled(FormControl)`
  width: 200px;
  & > div > div {
    display: flex;
    align-items: center;
  }
  margin-bottom:20px;
`;
export const MyTextArea = styled(TextField)`
  width: 200px;
  margin: 0px 30px;
`;
export const MyKeyboardDatePicker = styled(KeyboardDatePicker)`
  margin: 30px 30px 0px 30px;
`;
export const TitleAndDate = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin: 10px 0px;
`;
export const Title = styled.div`
  font-size: 30px;
  padding: 20px 20px 0px 20px;
  font-weight: bold;
  box-sizing: border-box;
`;

export const MyTableHead = styled(TableHead)`
  background-color: rgb(214, 214, 214);
`;

export const MyTableCell = styled(TableCell)`
  border: 1px solid rgb(180, 180, 180);
  min-width: 100px;
  &.date {
    width: 200px;
    min-width: 200px;
  }
  &.firstCell {
    background-color: rgb(214, 214, 214);
  }
  &.high {
    background-color: rgb(39, 100, 185);
  }
  &.medium {
    background-color: rgba(39, 100, 185, 0.8);
  }
  &.low {
    background-color: rgba(39, 100, 185, 0.3);
  }
  &:hover {
    transform: scale(0.98);
  }
`;

export const PaperContainer = styled.div`
  width: 100%;
  min-width: 500px;
  min-height: 500px;
  background-color: white;
  box-sizing: border-box;
  border-radius: 3px;
  margin-bottom: 20px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12);
`;

export const Display = styled.div`
  &.gallery {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    & > div {
      min-width: 600px;
      width: 45%;
    }
    & > div:nth-last-child(1) {
      width: 100%;
    }
    /* flex-direction: column; */
  }

  &.list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    & > div {
      width: 100%;
    }
  }
`;
