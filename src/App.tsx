import { ProTable } from '@ant-design/pro-components';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];

const App = () => {
  return (
    <ProTable columns={columns} request={async () => ({ data: [], success: true })} rowKey="id" />
  )
}
export default App;
