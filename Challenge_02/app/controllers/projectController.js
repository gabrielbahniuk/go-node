const { Project, Section, User } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const project = await Project.create({ ...req.body, UserId: req.session.user.id });
      req.flash('success', 'Projeto criado com sucesso!');
      return res.redirect(`/app/projects/${project.id}`);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const user = await User.findOne({
        where: { id: req.session.user.id },
      });

      const projects = await Project.findAll({
        include: [Section],
        where: { UserId: req.session.user.id },
      });

      const sections = await Section.findAll({
        where: { ProjectId: req.params.id },
      });

      const project = await Project.findOne({
        where: { id: req.params.id },
      });

      return res.render('project/show', {
        projects,
        sections,
        activeProject: req.params.id,
        project,
        user,
      });
    } catch (err) {
      return next(err);
    }
  },
};
