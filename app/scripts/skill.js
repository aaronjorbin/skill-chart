/* global _, $ */
_.mixin(_.str.exports());

var skills = {
	list: [
		'Design Theory',
		'Typography',
		'Color Theory',
		'Wireframing',
		'Standards and Usability',
		'Layout Systems',
		'Illustration',
		'Animation',
		'Project Management',
		'HTML/CSS',
		'Client Side Scripting',
		'WordPress API',
		'PHP',
		'SQL/Databases',
		'Perl/Bash',
		'Systems/Infastructure',
		'Information Security',
		'Computer Science / Theory'
	],
	maxPoints: 40,
	currentPoints: 0,
	assigned: [],
	capitalP: function(str){
		return _.titleize(str).replace(/Wordpress/g, 'WordPress')

	},



	init: function () {
		var self = this
		this.drawChart()
		if (window.location.search !== "")
			this.load()
		$('.level-1').find('.skill-unavailable').removeClass('skill-unavailable')
		this.updatePoints()
		$('.skill').click(function (e) {
			var up = $('#sc-' + $(this).data('skill') + '--' + (parseInt($(this).data('level'), 10) + 1))
			e.preventDefault()
			if ($(this).hasClass('skill-unavailable'))
				return

			if ($(this).hasClass('skill-active')) {
				if (up.hasClass('skill-active'))
					return

				$(this).removeClass('skill-active')
				up.addClass('skill-unavailable')


				self.currentPoints = self.currentPoints - 1
				self.assigned = _.without(self.assigned, $(this).attr('id')) 
//				self.assigned[$(this).attr('id')] = false
			} else {
				if ((self.currentPoints + 1) > self.maxPoints)
					return

				$(this).addClass('skill-active')
				up.removeClass('skill-unavailable')

				self.currentPoints = self.currentPoints + 1
				self.assigned.push($(this).attr('id'))
			}
			self.updatePoints()
			self.save()
		})
	},

	updatePoints: function () {
		var points = this.maxPoints - this.currentPoints
		$('#points-remaining').text(points)
	},

	save:function(){
		console.log(this.assigned)
		window.history.replaceState(this.assigned, "Jake's Theory of Skill", '?sc=' + 
			encodeURIComponent( JSON.stringify(this.assigned) ) )
	},
	addBlock: function(item){
			var up = $('#sc-' + item.data('skill') + '--' + (parseInt(item.data('level'), 10) + 1))
			item.addClass('skill-active')
			up.removeClass('skill-unavailable')
			this.currentPoints = this.currentPoints + 1
	},
	load: function(){
		var toLoad = JSON.parse(decodeURIComponent(window.location.search.substring(1).split('=')[1]))
		_.each(toLoad, function(id){
			console.log(this)
			this.addBlock( $('#'+id) )
		}, this)
		this.assigned = toLoad
		console.log(this.currentPoints)
	},

	drawChart: function () {
		var html = [],
			template = _.template($('#tdTemplate').text()),
			i, ii

		html.push('<table id="skillTable">')
		for (i = 0; i < 9; i++) {
			html.push('<tr class="level-')
			html.push(9 - i)
			html.push('">')
			for (ii = 0; ii < this.list.length; ii++) {
				html.push(template({
					'skill': ii,
					'level': 9 - i
				}))

			}
			html.push('</tr>')
		}
		html.push('<tr>')
		for (ii = 0; ii < this.list.length; ii++) {
			html.push('<th class="labels">')
			html.push( this.capitalP(this.list[ii].replace(/\s/g, '&nbsp;')))
			html.push('</th>')
		}
		html.push('</tr>')
		html.push('</table>')
		$('#skills').append(html.join(''))
	}



}

skills.init()
