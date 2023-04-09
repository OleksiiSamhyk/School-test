import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel } from "./components/TabPanel";
import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchVisitLogData } from "./redux/visitLogSlice";
import { AppDispatch } from "./redux/store";
import { VisitLog } from "./components/VisitLog";
import { InfoPage } from "./components/InfoPage";

export default function App() {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchVisitLogData());
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Табличка" />
          <Tab label="Інфо" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <VisitLog />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InfoPage />
      </TabPanel>
    </Box>
  );
}
