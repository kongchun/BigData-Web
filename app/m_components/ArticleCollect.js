import React from 'react';
import {
	Link
} from 'react-router';
import ArticleActions from '../actions/ArticleActions';

class ArticleCollect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {collected: false};
	}
	componentDidMount(){
		var _this = this;
		var articleId =  getArticelId(window.location.href);
		//初始化时根据名称查当前用户的信息
		var collectMsg = {
			name:'胡和浩的爷爷',
			articleId:articleId
		}
		function getArticelId(url){
			if(url){
				var lIndex = url.lastIndexOf("/");
				var dotIndex = url.lastIndexOf("?");
				return parseInt(url.substring(lIndex+1,dotIndex));
			}
		}
		ArticleActions.getArticleByUser(collectMsg).then(function(data){
			if(data.collect.indexOf(collectMsg.articleId+"") < 0){
				_this.setState({collected:false});
			}else{
				_this.setState({collected:true});
			}
		});
    }
	onHandleCollectClick(event){
		//收藏文章
		var currentTarget = event.currentTarget;
		var articleId = this.props.articleId;
		if($(currentTarget).hasClass('glyphicon-star-empty')){
			$(currentTarget).removeClass("glyphicon-star-empty").addClass("glyphicon-star");
			$(".article-collect-label").text("已收藏");
			var collectMsg = {
				name:'胡和浩的爷爷',
				type:'1',
				articleId:articleId
			}
			ArticleActions.articleCollect(collectMsg);
		}else{
			//取消收藏
			$(currentTarget).removeClass("glyphicon-star").addClass("glyphicon-star-empty");
			$(".article-collect-label").text("收藏");
			var cancelCollectMsg = {
				name:'胡和浩的爷爷',
				type:'1',
				articleId:articleId
			}
			ArticleActions.cancelArticleCollect(cancelCollectMsg)
		}
    }
	render(){
		var collect = this.state.collected;
		var text = collect ? "取消收藏":'收藏';
		var clazzName = collect ? "glyphicon glyphicon-star":"glyphicon glyphicon-star-empty";
		return (
			<span className="article-collect">
					<i className="article-collect-label">{text}</i>
					<i className={clazzName} onClick={this.onHandleCollectClick.bind(this)}></i>
			</span>
		);
    }
}

export default ArticleCollect;