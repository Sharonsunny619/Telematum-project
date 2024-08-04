import { Box } from '@mantine/core';
import './App.css';
import Layout from './createTable/TablesList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Box>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
