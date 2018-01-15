import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { changeModalVisibility } from 'actions/ui'

/* Styles */
import classNames from 'classnames/bind'
import styles from 'css/main'
const cx = classNames.bind(styles)

class Modal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }
    }

    render() {
        const { children, noClose } = this.props

        return (
            <div className={cx("modal")}>
                <Link className={cx("modalOuter")}></Link>
                <div className={cx("modalContent", "hero")} style={{ backgroundColor: 'transparent', color: 'white' }}>
                    {!noClose && <Link onClick={this.onClose.bind(this)}><i style={{ color: 'gray' }} className={cx("material-icons", "modalClose")}>close</i></Link>}
                    <div className="container">
                        <div className="row">
                            <div className={cx("col s12", "marginTop")}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onClose() {
        this.props.changeModalVisibility(false)
    }
}

function mapStateToProps(state, ownProps) {
    return {
        children: ownProps.children,
        noClose: ownProps.noClose
    }
}

Modal.propTypes = {
    children: PropTypes.element.isRequired, //Componente a renderizar, se coloca entre la etiqueta abre y cierre del compoenente
    noClose: PropTypes.bool //Mostrar o no la X para cerrar el modal
}

export default connect(mapStateToProps, { changeModalVisibility })(Modal)