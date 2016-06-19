/**
 * Created by Yc on 2016/6/16.
 */
var imgWaterFall = React.createClass({
    render : function () {
        var data = this.state.data.map((x,i)=>{
            return <ImgItem src={x} key={i}/>;
        });
        return (
            <ul className='img-wf'>
                {data}
            </ul>
        );
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount : function () {
        
    },
    loadDataFromServer : function (n) {
        $.get()
    }
});

var ImgItem = React.createClass({
    render : function () {
        return (
            <li><div className='img-item'><img onLoad={this.onload} src={this.props.src} /></div></li>
        );
    },
    onload : function (e) {

    }
});

ReactDOM.render(<imgWaterFall />,document.querySelector('[react=imgWaterFall]'));