var db = require('./db.js');
var db2 = require('./db2.js');

exports.articlesByPage = function(page, limit) {
	var start = (page - 1) * limit;
	return db.open("articles").then(function(collection) {
		return collection.find({
			"delete": null,
            "similar": {$ne:'',$exists:true}
		}).sort({
			createDate: -1
		}).skip(start).limit(limit).toArray();
	}).then(function(data) {
		console.log(data.length, "data");
		return db.collection.find().count().then(function(count) {
			db.close();
			return ({
				limit,
				count,
				page,
				data
			});
		})
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.articlesByHits = function(page, limit, time) {
    var start = (page - 1) * limit;
    return db.open("articles").then(function(collection) {
		if(!!time){
			return collection.find({
				"delete": null,
				"similar": {$ne:'',$exists:true},
				"createDate":{$gte:time}
			}).sort({
				hits : -1,
				createDate: -1
			}).skip(start).limit(limit).toArray();
		}else{
			return collection.find({
				"delete": null,
				"similar": {$ne:null,$exists:true}
			}).sort({
				hits : -1,
				createDate: -1
			}).skip(start).limit(limit).toArray();
		}
    }).then(function(data) {
        return db.collection.find().count().then(function(count) {
            db.close();
            return ({
                limit,
                count,
                page,
                data
            });
        })
    }).catch(function(error) {
        db.close();
        console.error(error)
        throw error;
    })
}

exports.article = function(id) {
	return db.open("articles").then(function(collection) {
		return collection.findOne({
			"id": id
		});
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.articleWithHits = function(id) {
	return db.open("articles").then(function(collection) {
		return collection.findOne({
			"id": id
		});
	}).then(function(data) {
		console.log("get------------------------------"+data)
		return data
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}
exports.addArticleWithHits = function(data){
	let hits = parseInt(data.hits) + 1;
	let id = data.id;
	data.hits = hits;
	console.log("insert----------------------------"+hits)
	return db.open("articles").then(function(collection) {
		return collection.update({
			'id': id
		}, {
			'$set': {
				'hits': hits
			}
		})
	}).then(function(data) {
		console.log("insert----------------------------"+data)
		db.close();
		return (data);
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.articlesByIds = function(ids) {
	db.close();
	var arr = ids.map((i) => i)
	console.log("articlesByIds"+arr)
	return db.open("articles").then(function(collection) {
		return collection.find({
			"id": {
				"$in": arr
			}
		}).toArray();
	}).then(function(data) {
		db.close();
		return (data);
	}).catch(function() {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.articlesByWords = function(words,limit) {
	db.close();
	var arr = [];
    for(var i=0;i<words.length;i++){
        arr[i] = eval('/'+words[i]+'/');
    }
	return db.open("articles").then(function(collection) {
		return collection.find({$or:[{
			"tags": {
				$in: arr
			}},{"title": {
				$in: arr
			}}]
		}).sort({
			hits : -1,
            createDate: -1
        }).skip(0).limit(limit).toArray();
	}).then(function(data) {
		return db.collection.find({$or:[{
            "tags": {
                $in: arr
            }},{"title": {
            $in: arr
        }}]
        }).count().then(function(count) {
			db.close();
			return ({
				limit,
				count,
				data
			});
		})
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.setArticleKeyCounts = function(id,arr) {
	db.close();
	return db.open("word_relation").then(function(collection) {
		return collection.findOne({
			"id": id
		});
	}).then(function(data) {
		//���ص��������߼��жϲ���1
		var keyWord = data.keyword;
		if(arr!=null && arr!=undefined){
		  for(var key in arr){
			  if(arr[key]>0){
				  var kwCount = keyWord[key];
				  kwCount = kwCount + 1;
				  keyWord[key] = kwCount;
			  }
		  }
		}
		//update����
		return db.collection.update({
			"id":id
		},{
			$set:{
			"keyword":keyWord
		}
		}).then(function() {
			db.close();
			return;
		})
	}).catch(function() {
		db.close();
		console.error(error)
		throw error;
	})
}
//��ȡ�ؼ���Ȩ��
exports.getKeyWordsCountJson = function(id) {
	db.close();
	return db.open("word_relation").then(function(collection) {
		return collection.findOne({
			"id": id
		});
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}
exports.getHotdotsData = function() {
	db.close();
	return db.open("keyword_sort").then(function(collection) {
		return collection.find({}).sort({
			"id":-1
		}).limit(8).toArray();
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.setUserData = function(userinfo) {
	db.close();
	return db.open("users").then(function(collection) {
		return collection.insert(userinfo)
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

exports.getUserData = function(unionid) {
	db2.close();
	return db2.open("users").then(function(collection) {
		return collection.find({"unionid":{$in:[unionid],$exists:true}}).toArray();
	}).then(function(data) {
		db2.close();
		return data;
	}).catch(function(error) {
		db2.close();
		console.error(error)
		throw error;
	})
}

exports.userData = function(userinfo) {
	db.close();
	return db.open("users").then(function(collection) {
		console.log("user:" + userinfo.unionid)
		return collection.find({"unionid":{$in:[userinfo.unionid],$exists:true}}).toArray();
	}).then(function(data) {
		if(data.length < 1){
			userinfo['collect'] = [];
			userinfo['marking'] = {};
			return db.collection.insert(userinfo).then(function(){
				db.close();
				return;
			});
		}else{
			db.close();
			return ;
		}
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
		return ;
	})
}

//收藏
exports.setArticleCollect = function(unionid,name,articleId,collectDate,articleTitle,thumbnail,smartSummary,tags){
	db.close();
	return db.open('users').then(function(collection){
		return collection.findOne({
			'unionid':{$in:[unionid],$exists:true}
		});
	}).then(function(data){
		if(data){
			var hasCollect = false;
			for(var i in data.collect){
				if(data.collect[i].articleId == articleId){
					hasCollect = true;
					break;
				}
			}
			if(!hasCollect){
				var collect = {
					"articleId" : articleId,
					"collectTime" : collectDate,
					"articleTitle" : articleTitle,
					"thumbnail":thumbnail,
					"tags":tags,
                    "smartSummary" : smartSummary
                }
				data.collect.push(collect);
				var newCollect = data.collect;
				return db.collection.updateOne({
					'unionid':{$in:[unionid],$exists:true},
				},{
					$set:{
						'collect':newCollect
					}
				}).then(function(data){
					db.close();
					return data;
				});
			}


		}else{
			db.close();
			return null;
		}
	}).catch(function(error){
		db.close();
		console.error(error)
		throw error;
	})
}
//取消收藏
exports.cancelArticleCollect = function(unionid,name,articleId,thumbnail){
	db.close();
	return db.open("users").then(function(collection){
		return collection.findOne({
			'unionid':{$in:[unionid],$exists:true}
		});
	}).then(function(data){
		var hasCollect = false;
		var index = 0;
		for(var i in data.collect){
			if(data.collect[i].articleId == articleId){
				hasCollect = true;
				index  = i;
				break;
			}
		}
		if(hasCollect){
			data.collect.splice(index,1);
		}
		var newCollect = data.collect;
		return db.collection.updateOne({
			'unionid':{$in:[unionid],$exists:true}
		},{
			$set:{
				'collect':newCollect
			}
		}).then(function(data){
			db.close();
			return data;
		}).catch(function(error){
			db.close();
			console.error(error);
			throw error;
		});
	})
}

exports.recordLog = function(action){
	db.close();
	return db.open("action_log").then(function(collection){
		console.log("action" + action)
		console.log("type" + typeof action)
		return collection.insert(action);
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error){
		db.close();
		console.error(error)
		throw error;
	})
}