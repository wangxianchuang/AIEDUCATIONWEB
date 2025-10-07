import { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Table, Tag, Space, message, Modal, Rate, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, CheckCircleOutlined, FileTextOutlined, BookOutlined, CoffeeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

function App() {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [solutionForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isRewardModalVisible, setIsRewardModalVisible] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    // 在实际应用中，这里应该从API获取数据
    const mockQuestions = [
      {
        id: 1,
        title: '如何将AI工具融入课堂教学？',
        description: '我是一名高中数学老师，想了解如何有效地将AI辅助教学工具融入到日常教学中，尤其是在解题指导方面。',
        category: '教学方法',
        difficulty: 3,
        status: '待解决',
        createdAt: '2023-10-01 14:30',
        author: '张老师'
      },
      {
        id: 2,
        title: 'AI教育软件的选择标准是什么？',
        description: '学校计划采购一批AI教育软件，但不知道应该从哪些方面进行评估和选择。希望得到一些专业建议。',
        category: '工具选择',
        difficulty: 2,
        status: '已解决',
        solution: '评估AI教育软件时，应考虑以下几个方面：1) 教学效果评估；2) 数据隐私保护；3) 教师培训支持；4) 成本效益分析；5) 与现有教学系统的兼容性。',
        createdAt: '2023-09-28 09:15',
        author: '李校长'
      },
      {
        id: 3,
        title: '如何应对学生使用AI撰写作业的问题？',
        description: '最近发现有些学生使用AI工具完成论文和作业，这对传统的作业评估方式带来了挑战。应该如何应对这种情况？',
        category: '伦理问题',
        difficulty: 4,
        status: '待解决',
        createdAt: '2023-09-25 16:45',
        author: '王教授'
      }
    ];
    setQuestions(mockQuestions);
    setFilteredQuestions(mockQuestions);
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (searchTerm) {
      const filtered = questions.filter(question => 
        question.title.includes(searchTerm) || 
        question.description.includes(searchTerm) ||
        question.category.includes(searchTerm)
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  }, [searchTerm, questions]);

  // 提交问题
  const handleSubmit = (values) => {
    const newQuestion = {
      id: questions.length + 1,
      title: values.title,
      description: values.description,
      category: values.category,
      difficulty: values.difficulty,
      status: '待解决',
      createdAt: new Date().toLocaleString('zh-CN'),
      author: values.author || '匿名用户'
    };
    
    setQuestions([newQuestion, ...questions]);
    form.resetFields();
    message.success('问题提交成功！');
  };

  // 打开解决方案模态框
  const showSolutionModal = (question) => {
    setSelectedQuestion(question);
    solutionForm.setFieldsValue({ solution: question.solution || '' });
    setIsModalVisible(true);
  };

  // 提交解决方案
  const handleSolutionSubmit = (values) => {
    const updatedQuestions = questions.map(question => 
      question.id === selectedQuestion.id 
        ? { ...question, solution: values.solution, status: '已解决' }
        : question
    );
    setQuestions(updatedQuestions);
    setIsModalVisible(false);
    message.success('解决方案提交成功！');
  };

  // 打开打赏模态框
  const showRewardModal = () => {
    setIsRewardModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '问题标题',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <a onClick={() => showSolutionModal(record)} style={{ cursor: 'pointer' }}>
          {text}
        </a>
      )
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '教学方法', value: '教学方法' },
        { text: '工具选择', value: '工具选择' },
        { text: '伦理问题', value: '伦理问题' }
      ],
      onFilter: (value, record) => record.category === value,
      render: category => (
        <Tag color={
          category === '教学方法' ? 'blue' :
          category === '工具选择' ? 'green' : 'purple'
        }>
          {category}
        </Tag>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      sorter: (a, b) => a.difficulty - b.difficulty,
      render: difficulty => (
        <Rate disabled defaultValue={difficulty} allowHalf={false} />
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '待解决', value: '待解决' },
        { text: '已解决', value: '已解决' }
      ],
      onFilter: (value, record) => record.status === value,
      render: status => (
        <Tag color={status === '已解决' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: '提问者',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<FileTextOutlined />}
            onClick={() => showSolutionModal(record)}
          >
            查看详情
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="app">
      {/* 头部 */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <h1>AI教育应用问题收集平台</h1>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="main-content">
        <div className="container">
          {/* 搜索框 */}
          <div className="search-container">
            <Input
              placeholder="搜索问题标题、描述或类别"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: 600, marginBottom: 20 }}
            />
          </div>

          {/* 问题提交卡片 */}
          <Card title="提交新问题" style={{ marginBottom: 20 }}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="title"
                label="问题标题"
                rules={[{ required: true, message: '请输入问题标题' }]}
              >
                <Input placeholder="请输入问题标题" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="问题描述"
                rules={[{ required: true, message: '请输入问题描述' }]}
              >
                <TextArea rows={4} placeholder="请详细描述您的问题，以便获得更好的解决方案" />
              </Form.Item>
              
              <Form.Item
                name="category"
                label="问题类别"
                rules={[{ required: true, message: '请选择问题类别' }]}
              >
                <Select placeholder="请选择问题类别">
                  <Option value="教学方法">教学方法</Option>
                  <Option value="工具选择">工具选择</Option>
                  <Option value="伦理问题">伦理问题</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="difficulty"
                label="问题难度"
                rules={[{ required: true, message: '请选择问题难度' }]}
              >
                <Rate allowHalf defaultValue={3} />
              </Form.Item>
              
              <Form.Item name="author" label="您的称呼">
                <Input placeholder="请输入您的称呼（选填）" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <PlusOutlined style={{ marginRight: 4 }} /> 提交问题
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* 问题列表 */}
          <Card title={`问题列表 (${filteredQuestions.length})`}>
            <Table 
              columns={columns} 
              dataSource={filteredQuestions} 
              rowKey="id" 
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      </main>

      {/* 解决方案模态框 */}
      <Modal
        title={`问题详情 - ${selectedQuestion?.title}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedQuestion && (
          <div className="solution-modal">
            <div className="question-detail">
              <h3>{selectedQuestion.title}</h3>
              <p className="question-description">{selectedQuestion.description}</p>
              <div className="question-meta">
                <Tag color="blue">{selectedQuestion.category}</Tag>
                <span>难度：{selectedQuestion.difficulty}星</span>
                <span>状态：{selectedQuestion.status}</span>
                <span>创建时间：{selectedQuestion.createdAt}</span>
                <span>提问者：{selectedQuestion.author}</span>
              </div>
            </div>
            
            <Divider />
            
            <div className="solution-section">
              <h4>解决方案</h4>
              {selectedQuestion.solution ? (
                <div className="solution-content">
                  {selectedQuestion.solution}
                </div>
              ) : (
                <p className="no-solution">暂无解决方案</p>
              )}
              
              {selectedQuestion.status !== '已解决' && (
                <div className="submit-solution">
                  <h5>提交解决方案</h5>
                  <Form form={solutionForm} layout="vertical" onFinish={handleSolutionSubmit}>
                    <Form.Item
                      name="solution"
                      rules={[{ required: true, message: '请输入解决方案' }]}
                    >
                      <TextArea rows={6} placeholder="请输入解决方案" />
                    </Form.Item>
                    
                    {selectedQuestion.status !== '已解决' && (
                      <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                          <CheckCircleOutlined style={{ marginRight: 4 }} /> 提交解决方案
                        </Button>
                      </Form.Item>
                    )}
                  </Form>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 打赏模态框 */}
      <Modal
        title="支持我们"
        open={isRewardModalVisible}
        onCancel={() => setIsRewardModalVisible(false)}
        footer={null}
        width={500}
      >
        <div className="reward-modal">
          <p style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>目前本网站的运营没有收入来源，如果能够帮助到您，希望得到您的支持！！！</p>
          <div className="qrcode-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 200, height: 200, backgroundColor: 'white', margin: '0 auto 10px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
                <span style={{ color: '#999' }}>微信二维码</span>
              </div>
              <p style={{ fontSize: 14, color: '#666' }}>请扫描二维码支持我们</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* 页脚 */}
      <footer className="footer">
        <div className="footer-content">
          <p>AI教育应用问题收集平台 © 2025</p>
          <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>致力于为教育工作者提供AI应用相关问题的交流与解决方案</p>
          <Button 
            type="link" 
            icon={<CoffeeOutlined />} 
            onClick={showRewardModal}
            style={{ marginTop: 10 }}
          >
            打赏支持
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default App;