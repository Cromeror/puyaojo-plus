import React, { Component } from 'react'
import { Col, Input, Form, Icon } from 'antd';
import { Row } from 'antd/lib/grid';
import { Button } from 'antd/lib/radio';

const FormItem = Form.Item
const defaultGutter = 12
const defaultSpan = 24
class EasyForm extends React.Component {
    state = {
        expand: false,
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    // To generate mock Form.Item
    getFields(fields = new Array(), span) {
        const { getFieldDecorator } = this.props.form
        const children = []

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i],
                item = <Input
                    placeholder={field.placeholder ? field.placeholder : ""} />

            children.push(
                <Col span={span} key={field.key} /* style={{ display: i < count ? 'block' : 'none' }} */>
                    <FormItem label={field.label}>
                        {getFieldDecorator(field.id ? field.id : field.key)(item)}
                    </FormItem>
                </Col>
            );
        }
        return <Row gutter={defaultGutter}>{children}</Row>;
    }

    render() {
        const { fields } = this.props
        const span = this.props.span ? this.props.span : defaultSpan

        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}>
                {this.getFields(fields, span)}
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">Search</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            Clear
                            </Button>
                        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                            Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
                        </a>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default (EasyForm)