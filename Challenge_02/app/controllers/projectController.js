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

  async showAll(req, res, next) {
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

      return res.render('projects/show', {
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
  async destroy(req, res, next) {
    try {
      await Project.destroy({ where: { id: req.params.id } });
      req.flash('success', 'Projeto removido com sucesso!');
      return res.redirect('/app/dashboard');
    } catch (err) {
      return next(err);
    }
  },
};
