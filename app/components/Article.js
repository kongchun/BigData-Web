import React from 'react';
import {
	Link
} from 'react-router';

import ArticleStore from '../stores/ArticleStore';
import ArticleActions from '../actions/ArticleActions';
import Similar from './Similar';


class Article extends React.Component {
	constructor(props) {
		super(props);
		this.state = ArticleStore.getState();
		this.onChange = this.onChange.bind(this);
	}
	componentDidMount() {
		const id = this.props.params.id
		ArticleStore.listen(this.onChange);
		ArticleActions.getArticleById(id);
	}

	componentWillUnmount() {
		ArticleStore.unlisten(this.onChange);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.params.id != this.props.params.id) {
			ArticleActions.getArticleById(this.props.params.id);
		}
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		var article = (this.state.data);

		function createMarkup() {
			return {
				__html: article.html
			};
		};

		function tagList() {
			var tags = article.abstract;
			var arr = new String(tags).split(",") //tags.split(",");
			var tagHtml = arr.map((i) => (<a>{i}</a>))
			return tagHtml;
		}

		return (
			<section className="content-wrap">
	        	<div className="container">
		        	<div className="row">
			        	<main className="col-md-8 main-content">
			        		<article className="post">
						    <header className="post-head">
						        <h1 className="post-title">{article.title}</h1>
						        <section className="post-meta">
						            <span className="url">来源：<a href={article.url} >{article.url}</a></span>
									<span className="url">阅读次数：{article.hits}</span>
						        </section>
						    </header>
						    <section className="post-content" dangerouslySetInnerHTML={createMarkup()}>
						    </section>
						    </article>
						</main>
						<aside className="col-md-4 sidebar">
							<div className="widget">
								<h4 className="title">关键字</h4>
								<div className="content tag-cloud">
									 {tagList()}
								</div>
							</div>

							<div className="widget">
								<h4 className="title">相似文章</h4>
								<Similar ids={article.similar}/>
							</div>
						</aside>
					</div>
				</div>
			</section>
		);
	}
}


export default Article;