const { Section, Project, User } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const { projectId } = req.params;
      const section = await Section.create({ ...req.body, ProjectId: projectId });
      req.flash('success', 'Section successfully created!');
      return res.redirect(`/app/projects/${projectId}/sections/${section.id}`);
    } catch (err) {
      return next(err);
    }
  },
  async show(req, res, next) {
    try {
      const { projectId, id } = req.params;

      const projects = await Project.findAll({
        include: [Section],
        where: { UserId: req.session.user.id },
      });

      const sections = await Section.findAll({
        where: { ProjectId: projectId },
      });

      const project = await Project.findOne({
        where: { id: projectId },
      });

      const user = await User.findOne({
        where: { id: req.session.user.id },
      });

      const section = await Section.findById(id);

      return res.render('sections/show', {
        activeProject: projectId,
        projects,
        sections,
        currentSection: section,
        project,
        user,
      });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const section = await Section.findById(req.params.id);
      await section.update(req.body);
      req.flash('success', 'Section updated!');
      return res.redirect(`/app/projects/${req.params.projectId}/sections/${section.id}`);
    } catch (err) {
      return next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      await Section.destroy({ where: { id: req.params.id } });
      req.flash('success', 'Section removed!');
      return res.redirect(`/app/projects/${req.params.projectId}`);
    } catch (err) {
      return next(err);
    }
  },
};
