import React, { useState } from "react";
import ReactDOM from "react-dom";

import { Form, Row, Col, Input, Button, DatePicker, Select, Checkbox, Tooltip } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import { GlobalContext } from "../components/GlobalContext";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = (props) => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  const context = React.useContext(GlobalContext);

  const onFinish = (values) => {
    props.searchRequest(values);
  };

  return (
    <Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={1}>
          <Form.Item name="name" label="Patient Name" colon={false} labelCol={{span: 24}} wrapperCol={{span: 24}}>
            <Input placeholder="Enter Patient's first or last name to filter" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={2}>
          <Form.Item name="birthdate" label="Birthdate Range" colon={false} labelCol={{span: 24}} wrapperCol={{span: 24}}>
            <RangePicker />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={3}>
          <Form.Item name="gender" label="Gender" colon={false} labelCol={{span: 24}} wrapperCol={{span: 24}}>
            <Select placeholder="Select a gender to filter" allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
        </Col>

        {expand && (
          <React.Fragment>
            <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={4}>
              <Form.Item name="phone" label="Phone number" colon={false}>
                <Input placeholder="Enter phone number to filter" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={5}>
              <Form.Item name="address" label="Country and Address" colon={false}>
                <Input placeholder="Enter country code to filter" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={6}>
              <Form.Item name="maritalStatus" label="Marital Status" colon={false}>
                <Input placeholder="Enter marital status to filter" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={7}>
              <Form.Item name="id" label="Patient ID" colon={false}>
                <Input placeholder="Enter Patient ID to filter" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} key={8}>
              <Form.Item name="anythingElse" label="Search for anything else" colon={false}>
                <Input.TextArea
                  placeholder="Just type anything you would like to search, you can search for Social Security Number, Driver's License, Passport Number, Ethics, etc. Regular expression is supported."
                />
              </Form.Item>
            </Col>
          </React.Fragment>
        )}
      </Row>

      <Row justify="end">
        <Col span={24}>
          <Form.Item name="exactMatch" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox checked>
              <Tooltip
                placement={context.isMobile ? "top" : "right"}
                title="Match the exact content from the search query"
              >
                Exact Match
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 8 }}
            className={context.isMobile ? "mobile-search-button" : ""}
          >
            Search
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Clear
          </Button>
          {!expand && (
            <a
              className="search-more"
              onClick={() => {
                setExpand(!expand);
              }}
            >
              <DownOutlined /> Search More
            </a>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
