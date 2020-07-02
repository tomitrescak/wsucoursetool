const units = {
  '200022': {
    name: 'Mathematical Modelling',
    code: '200022',
    level: '3',
    credits: '10',
    coordinator: 'Stephen Weissenhofer',
    about:
      'Mathematical Modelling is about solving real world problems. The real world is a complicated place which we often need or want to understand better. One way to do this is to set up a mathematical model which we hope can provide insights, predictions and a greater understanding of a complex system. Selected real-world problems are approximated by mathematical models that are amenable to being written in terms of linear and non-linear equations or differential equations.  Once equations are solved emphasis is placed on interpreting solutions, modifying models as required and using  models for prediction.',
    assumed: 'Matrix algebra and how to find eigenvalues and eigenvectors.',
    prerequisite: ['200030']
  },
  '200023': {
    name: 'Analysis',
    code: '200023',
    level: '3',
    credits: '10',
    coordinator: 'Rehez Ahlip',
    about:
      'Analysis provides the theoretical basis of real and complex numbers, including differentiation and integration. Topics include: field axioms and completeness, sequences, series, convergence, compactness, continuity, differentiability, integrability, and related theorems in both the real and complex number systems.',
    prerequisite: ['200028'],
    equivalent: ['14388']
  },
  '200025': {
    name: 'Discrete Mathematics',
    code: '200025',
    level: '1',
    credits: '10',
    coordinator: 'Leanne Rylands',
    about:
      'This unit introduces set theory, symbolic logic, graph theory and some counting problems.  It provides a solid foundation for further study in mathematics or computing.',
    assumed: 'HSC Mathematics or equivalent',
    equivalent: ['700010'],
    incompatible: ['300699']
  },
  '200027': {
    name: 'Linear Algebra',
    code: '200027',
    level: '2',
    credits: '10',
    coordinator: 'Shatha Aziz',
    about:
      'The objective of this unit is to present the main fundamentals of linear algebra and includes such topics as solving systems of linear equations, matrix algebra, determinants, eigenvalues and eigenvectors, Euclidean vector spaces, general vector spaces, inner product spaces and linear transformations.',
    assumed:
      'Solving systems of equations with two and three unknowns, basic matrix operations, including multiplication.'
  },
  '200028': {
    name: 'Advanced Calculus',
    code: '200028',
    level: '2',
    credits: '10',
    coordinator: 'Stephen Weissenhofer',
    about:
      'This unit is designed for students undertaking studies in mathematics, statistics, operations research and mathematical finance. It provides further mathematical training in the areas of multivariable and vector calculus, which is essential to the understanding of many areas of both pure and applied mathematics.',
    prerequisite: ['300673'],
    equivalent: ['14379', '14504', 'J2764'],
    incompatible: ['200238']
  },
  '200030': {
    name: 'Differential Equations',
    code: '200030',
    level: '2',
    credits: '10',
    coordinator: 'Alexander Lee',
    about:
      'Differential equations arise naturally both in abstract mathematics and in the study of many phenomena.  This unit provides the theory of ordinary differential equations and an introduction to partial differential equations together with methods of solution.  Examples are drawn from a wide range of biological, chemical, physical and economic applications.',
    assumed:
      'Algebra - competency in manipulation of algebraic terms including powers, sigma notation\r\nElementary functions - polynomial, power, exponential, logarithmic, circular and hyperbolic, inverse functions\r\nDifferentiation - derivatives of standard functions, product/quotient/composite function rules\r\nIntegration - integrals of standard functions, change of variable, integration by parts',
    incompatible: ['200238']
  },
  '200032': {
    name: 'Statistics for Business',
    code: '200032',
    level: '1',
    credits: '10',
    coordinator: 'Neil Hopkins',
    about:
      'Statistics for Business introduces the basic concepts and techniques of statistics that are particularly relevant to problem solving in business. It also provides a sound base for more advanced study in statistics and forecasting in subsequent sessions. Topics include: presentation of data; descriptive statistics; the role of uncertainty in business decision making; hypothesis testing; and basic forecasting.',
    assumed: 'HSC Mathematics/Mathematics Extension 1 is desirable.',
    equivalent: ['200192', '300700', '200263', '200052', '301123', '700007', '700033', '700041']
  },
  '200045': {
    name: 'Quantitative Project',
    code: '200045',
    level: '3',
    credits: '10',
    coordinator: 'Andrew Francis',
    about:
      'In this unit, students can deepen or apply knowledge gained during their course and practise verbal and written presentation skills. Students will carry out a project under the supervision of an academic staff member. Assisted by their supervisor, students will define the problem to be studied and then acquire, develop and apply the appropriate theory or methodology. They will prepare a final report presenting theoretical results or methodology, an analysis and a discussion followed by an appropriate conclusion, as well as a literature review or a list of references as appropriate. Students will also give a talk on their project.',
    rawPrerequisite: [
      'Students must have successfully completed 30 credit points of Level 2 mathematics/statistics units from 200027 Linear Algebra,\r\n200028 Advanced Calculus,\r\n200030 Differential Equations,\r\n301031 Computer Algebra,\r\n301032 Making Sense of Data,\r\n301033 Introduction to Data Science,',
      'Students must also have completed 30 credit points of Level 3 mathematics/statistics units from 200022 Mathematical Modelling,\r\n200023 Analysis,\r\n200193 Abstract Algebra,\r\n300958 Social Web Analytics,\r\n301034 Predictive Modelling, 301035 Environmental Informatics'
    ]
  },
  '200193': {
    name: 'Abstract Algebra',
    code: '200193',
    level: '3',
    credits: '10',
    coordinator: 'Roozbeh Hazrat',
    about:
      'This unit develops algebraic thought to a high level. The abstract concepts involved in the main topics (group theory and number theory) have many applications in science and technology, and the unit includes an application to cryptography.',
    prerequisite: ['200025'],
    equivalent: ['14702', '14383']
  },
  '200237': {
    name: 'Mathematics for Engineers 1',
    code: '200237',
    level: '1',
    credits: '10',
    coordinator: 'Charles Zworestine',
    about:
      'This unit is the first of two mathematics units to be completed by all students enrolled in an engineering degree during their first year of study. The content covers a number of topics that underpin the later-stage engineering mathematics units. The subject matter includes: differential and integral calculus of a single variable, complex numbers, aspects of matrix algebra, vectors, and some elementary statistics and probability theory. The aim of this unit is to introduce a number of key mathematical concepts needed in the study of Engineering, and to provide a solid foundation for the follow-on unit Mathematics for Engineers 2.',
    assumed: 'HSC Mathematics achieved at Band 5 or 6. This is the minimum requirement.',
    rawPrerequisite: [
      'Students enrolled in 3740 Bachelor of Engineering (Honours) or 3689 Bachelor of Engineering must have passed 300743 Mathematics for Engineers Preliminary otherwise permission is required.'
    ],
    equivalent: ['14505'],
    incompatible: ['200031']
  },
  '200238': {
    name: 'Mathematics for Engineers 2',
    code: '200238',
    level: '1',
    credits: '10',
    coordinator: 'Wei Xing Zheng',
    about:
      'This unit is the second of two mathematics units to be completed by students enrolled in an Engineering degree during their first year of study.  The content covers a number of topics that build on the calculus knowledge from Mathematics for Engineers 1. The subject matter includes:  ordinary differential equations, Laplace transforms and multi-variable calculus.',
    prerequisite: ['200237'],
    equivalent: ['700022']
  },
  '200242': {
    name: 'Mathematics for Engineers 3',
    code: '200242',
    level: '2',
    credits: '10',
    coordinator: 'Volker Gebhardt',
    about:
      'Students enrolled in Bachelor of Engineering who are yet to successfully complete 200242 Mathematics for Engineers 3, are to seek advice from Dr Jamal Rizk to enable them to complete the course.  This unit is a core unit in the Computer, Electrical, or Telecommunications key programmes of the Bachelor of Engineering course.  It builds on the first two mathematics units in that course and provides mathematical tools and techniques needed for the above key programmes.  The unit covers topics from advanced calculus including vector calculus, complex analysis, Fourier series, heat and wave equations, Fourier integrals and transforms; discrete mathematics including logic and set theory; random variables and random processes including mean, correlation and covariance functions, ergodicity, ensemble averages, and Gaussian processes.',
    prerequisite: ['14506'],
    equivalent: ['200194']
  },
  '200263': {
    name: 'Biometry',
    code: '200263',
    level: '1',
    credits: '10',
    coordinator: 'Preethi Kottegoda',
    about:
      'Biometry introduces students to various statistical techniques necessary in scientific endeavours. Presentation of the content will emphasize the correct principles and procedures for collecting and analysing scientific data, using a hands-on approach. Topics include effective methods of gathering data, statistical principles of designing experiments, error analysis, describing different sets of data, probability distributions, statistical inference, non-parametric methods, simple linear regression and analysis of categorical data.',
    assumed: 'HSC Mathematics or equivalent',
    equivalent: ['200192', '300700', '200032', '200052', '700033', '700041', '30123'],
    incompatible: ['200182']
  },
  '200413': {
    name: 'Mathematics Honours Thesis',
    code: '200413',
    level: '5',
    credits: '40',
    coordinator: 'Stephen Weissenhofer',
    about:
      "The aim of this unit is to further develop the student's research and problem solving skills. The student is required to implement the research plan, complete a substantive piece of research in the field of Mathematics/Statistics, and to communicate the results of that work to an interested and technically literate audience. All projects will therefore contain at least two broad areas of assessment: the substantive work itself, and the oral and written communication of the work to others. All assessment components submitted in both of these areas are expected to be of a high professional standard. Students will present their research in the thesis. The thesis topic and structure will vary according to the area of interest of the student and the expertise of the supervisor. Throughout this unit regular planned consultations between the student and supervisor will occur. Students are expected to work to a schedule devised in consultation with their supervisor. The schedule will include set dates for the presentation of draft chapters for review by the supervisor.",
    assumed:
      'To effectively research in the area of Mathematics/Statistics, an \tunderstanding and knowledge equivalent to an undergraduate Bachelor of Science (Mathematics) degree or key program in Mathematics/Statistics is required.'
  },
  '200424': {
    name: 'Statistics for Accountants (PG)',
    code: '200424',
    level: '7',
    credits: '10',
    coordinator: 'Kenan Matawie',
    about:
      'Statistics for Accountants introduces the basic concepts and techniques for statistical inference and decision making in a business context.',
    assumed: 'Mathematics to the HSC level.'
  },
  '300093': {
    name: 'Computer Graphics',
    code: '300093',
    level: '3',
    credits: '10',
    coordinator: 'Quang Vinh Nguyen',
    about:
      'Computer Graphics will examine elementary graphics concepts, algorithms and programming skills for producing graphical applications, in both two-dimension (2D) and three-dimension (3D) using Open GL. Techniques and algorithms will be programmed in Processing, which is a very easy-to-learn programming language yet powerful and comprehensive.',
    prerequisite: ['300147']
  },
  '300095': {
    name: 'Computer Networks and Internets',
    code: '300095',
    level: '3',
    credits: '10',
    coordinator: 'Sharon Griffith',
    about:
      'This unit extends on the work undertaken in the prerequisite unit and provides students with an in-depth explanation on the role of the architecture, components, and operations of routers and switches in a small network. Students will configure and troubleshoot routers and switches and resolve common issues with common routing protocols, virtual LANs, and inter-VLAN routing in both IPv4 and IPv6 networks. This is the second of three units that prepares the student for industry-based networking certification (CCNA).',
    assumed:
      'Fundamentals of data communications and computer networking, such as that covered in the prerequisite unit.',
    prerequisite: ['300565']
  },
  '300096': {
    name: 'Computer Organisation',
    code: '300096',
    level: '2',
    credits: '10',
    coordinator: 'Jianhua Yang',
    about:
      'This unit is designed for computer science students, particularly those interested in systems programming and hardware development. The students will learn about the interface between the hardware and software of a computer system. This will involve study of some aspects of computer architecture and low level interfacing to gain an insight into central processing unit (CPU) organisation at the assembly language level. After completing this unit students will be able to write procedures in an assembly language, use their understanding of the relationship between the instruction set architecture and the implementation of high level languages to write efficient programs.',
    rawPrerequisite: [
      'The following pre-requisites apply to all courses except 3771:',
      '300580 Programming Fundamentals OR\r\n300027 Engineering Computing AND\r\n200025 Discrete Mathematics OR\r\n200237 Mathematics for Engineers 1',
      'The following pre-requisite unit applies to course 3771 only:',
      '301335 Engineering Programming Fundamentals'
    ]
  },
  '300103': {
    name: 'Data Structures and Algorithms',
    code: '300103',
    level: '2',
    credits: '10',
    coordinator: 'Dongmo Zhang',
    about:
      'This unit introduces students to fundamental data structures and algorithms used in computing. The material covered forms the basis for further studies in programming and software engineering in later units and for further training in programming skills. The unit focuses on the ideas of data abstraction and algorithm efficiency. The issues of computational complexity of algorithms are addressed throughout the semester. The topics covered include the fundamental abstract data types (lists, stacks, queues, trees, hash tables, graphs), recursion, complexity of algorithms, sorting and searching algorithms, binary search trees and graphs.',
    prerequisite: ['300147']
  },
  '300104': {
    name: 'Database Design and Development',
    code: '300104',
    level: '2',
    credits: '10',
    coordinator: 'Zhuhan Jiang',
    about:
      'The main purpose of this unit is to provide students with an opportunity to gain a basic knowledge of database design and development including data modelling methods, techniques for database design using a set of business rules that are derived from a case study and finally implementation of the database using a commercial relational database management system. Through group work and tutorial practicals, students examine a number of important database concepts such as database administration, concurrency, backup and recovery and security whilst developing their professional communication and team work skills.',
    assumed:
      'Basic programming skills, including variable declaration, variable assignment, selection statement and loop structure.',
    equivalent: ['700011'],
    incompatible: ['200129']
  },
  '300111': {
    name: 'Developing Web Applications with XML',
    code: '300111',
    level: '3',
    credits: '10',
    coordinator: 'Heidi Bjering',
    about:
      'This third year unit provides a comprehensive coverage of XML, related emerging technologies and their use in web applications. Students will be given opportunities to develop web based information systems which rely upon these technologies. This unit is heavily oriented to practical based work.',
    assumed: '300582-Technologies for Web Applications, 300580-Programming Fundamentals'
  },
  '300115': {
    name: 'Distributed Systems and Programming',
    code: '300115',
    level: '3',
    credits: '10',
    coordinator: 'Evan Crawford',
    about:
      'This unit covers the concepts, design, and programming of distributed systems. It builds on basic network communication protocols (specifically IP) to cover client server programming using both the system level socket interface and remote procedure calls. It also examines large scale distributed system architectures particularly those based on distributed objects and considers the complexities inherent in distributed transactions. Key concepts covered include data and algorithmic distribution, idempotent protocols, stateless and statefull servers, and distributed system transparency. Illustrative case studies are included.',
    rawPrerequisite: [
      'Successful completion of 300565 Computer Networking and either 300147 Object Oriented Programming or 300581 Programming Techniques.'
    ]
  },
  '300128': {
    name: 'Information Security',
    code: '300128',
    level: '3',
    credits: '10',
    coordinator: 'Yun Bai',
    about:
      'Information Security is concerned with the protection and privacy of information in computer systems. The focus is primarily on introducing cryptography concept, algorithm and protocol in information security and applying such knowledge in the design and implementation of secure computer and network systems. The unit also addresses conventional and public key encryption, number theory and algebra and their application in public key encryption and signature. Students will learn the application of cryptography algorithm in current computer systems and information security management. This unit also provides students with the practical experience around security programming.',
    assumed:
      'Basic understanding of data structures, number theory and probability theory. Basic programming skills in C, C++, java, etc.',
    prerequisite: ['200025']
  },
  '300130': {
    name: 'Internet Programming',
    code: '300130',
    level: '3',
    credits: '10',
    coordinator: 'Chun Ruan',
    about:
      'This unit offers students basic concepts and latest technologies of internet programming and web-based application development.  Utilising one of the popular internet programming languages, such as Java, it aims to develop the programming skills and methodologies required for both client-side and server-side programming as well as general purpose programming.  The range of topics covered by the unit includes HTML, XML, Java applets, desktop application in Java, servlets, JavaServer Pages and JDBC.',
    assumed: 'Basic knowledge on internet browsing and any object-oriented programming language.',
    prerequisite: ['300147'],
    equivalent: ['300246']
  },
  '300134': {
    name: 'Introduction to Information Technology',
    code: '300134',
    level: '1',
    credits: '10',
    coordinator: 'Jianhua Yang',
    about:
      'This introductory unit gives students an insight into the history, structure, operations and uses of computers, and their impact on society. This will be complemented by hands-on use of computers and popular application software packages in a graphical user interface environment. Students gain a basic understanding of the uses of computers, and the skills necessary to use popular applications software, including word processing, spreadsheet and database packages, and Internet tools and services.',
    equivalent: ['B1582', 'J1742', '61211']
  },
  '300136': {
    name: 'I.T. Support Practicum',
    code: '300136',
    level: '3',
    credits: '10',
    coordinator: 'Chun Ruan',
    about:
      'This unit provides students real-world experience in the area of Information Technology (IT) support. Students are located with industry partners in the Greater Western Sydney region in IT support positions for 10 hours per week over a 12 week period. In addition, students receive instruction and tuition in aspects of professional practice such as code of ethics.',
    prerequisite: ['300150']
  },
  '300138': {
    name: 'LAN Workshop',
    code: '300138',
    level: '2',
    credits: '10',
    coordinator: 'Jiansheng Huang',
    about:
      'This unit provides students with the knowledge and skills necessary to install, test, tune, customise, repair and maintain networking hardware and software necessary to create a Local Area Network (LAN).  Students also learn how to administer a LAN by setting up user accounts, access privileges, security procedures and back-up/recovery procedures.',
    assumed:
      'Ability to list, discuss and compare the elements of information coding and signal transmission.  List, describe and explain the elements and functional relationships of communications hardware and software.  Identify, locate, distinguish and describe the individual hardware components of a personal computer (PC) and explain their purpose, functions and operations.  Install PC components, devices and peripherals in accordance with installation procedures and operational standards.',
    equivalent: ['300576']
  },
  '300143': {
    name: 'Network Security',
    code: '300143',
    level: '3',
    credits: '10',
    coordinator: 'Hon Cheung',
    about:
      'This unit is concerned with the protection of information transferred over computer networks. It includes discussion of techniques for securing data transported over local and wide area networks. At the conclusion of the unit students will have a good understanding of the practical aspects of securing a computer network against internal and external attacks.',
    assumed:
      'Good understanding of the principles of information security, and computer networks and internets.',
    prerequisite: ['300094']
  },
  '300144': {
    name: 'Object Oriented Analysis',
    code: '300144',
    level: '2',
    credits: '10',
    coordinator: 'Jiansheng Huang',
    about:
      'The core strength of this unit is to analyse and model business objectives and critical requirements of software systems to be developed using object-oriented (OO) approaches. The system analysis is taken to greater depths within the context of Object Orientation. The Unified Modelling Language version 2.0 (notably use cases, user case diagrams, activity diagrams, class diagrams and sequence diagrams) is used as the modelling standard for creating OO models in the problem space. The unit also covers the rational unified process methodology and applications of design patterns for software development through practical case studies.',
    assumed:
      'General understanding of what an information system is and how information systems development is undertaken and\r\n•\t Introductory knowledge about system analysis and design, including \r\n- basic problem solving experience in computerised information systems\r\n- ability to derive systems requirements from problem definitions\r\n- ability to produce system models using process, data, object and network modelling.\r\n- understanding design and implementation issues include, (but may not be limited to), elementary database design, input, output and user interface design and prototyping.\r\n•\t General knowledge on programming languages\r\n- Understanding difference between procedure programming  and object oriented programming   \r\n- Introductory knowledge of classes and objects and the class construction\r\n- Introductory knowledge on object orientation, including encapsulation, inheritance',
    prerequisite: ['300585'],
    equivalent: ['700039']
  },
  '300147': {
    name: 'Object Oriented Programming',
    code: '300147',
    level: '2',
    credits: '10',
    coordinator: 'Dongmo Zhang',
    about:
      'This unit presents the concepts and principles of programming languages with the emphasis on object oriented paradigm. It addresses the importance of the separation of behaviour and implementation as well as effective use of encapsulation, inheritance and polymorphism. The students will gain intensive training in programming skills with supervised laboratory sessions and task oriented assignments.',
    prerequisite: ['300580']
  },
  '300150': {
    name: 'PC Workshop',
    code: '300150',
    level: '1',
    credits: '10',
    coordinator: 'Miroslav Filipovic',
    about:
      'This unit introduces students to the hardware and software components of a stand-alone personal computer (PC).  Students become familiar with the CPU, memory, secondary storage, IO peripherals and communications devices commonly found in a PC.  They learn to assemble and disassemble a PC and to install hardware and software components according to supplier specifications.  Students also learn to use and customise the PC operating system to maintain and optimise PC performance.',
    assumed: 'Basic knowledge of personal computers.'
  },
  '300165': {
    name: 'Systems Administration Programming',
    code: '300165',
    level: '3',
    credits: '10',
    coordinator: 'Golenur Huq',
    about:
      'This unit covers programming techniques and tools used to administer standalone and networked computer systems. The unit focuses on the use of high level interpretive scripting languages to automate everyday administrative tasks, and to monitor and control running systems. Techniques to extend scripting language\r\ncapabilities by dynamic linking to compiled code are examined, particularly in terms of access to operating system level functions. The unit also examines the use of administrative programs and tools to monitor and adjust system performance and capacity.',
    assumed:
      'Students should have a thorough grounding in systems programming and operating systems basics.',
    prerequisite: ['300167'],
    incompatible: ['300577']
  },
  '300166': {
    name: 'Systems and Network Management',
    code: '300166',
    level: '3',
    credits: '10',
    coordinator: 'Weisheng Si',
    about:
      'With the advent of the era of Internet of Things, the Internet has become a huge infrastructure in which various kinds of systems are running to deliver a plethora of network services. To ensure the efficient utilization of network resources (e.g., bandwidth) and the convenient access to network services, systems and networks must be managed in a proper way. Facing this demand, this unit covers the standards, protocols and skills pertinent to the management of systems and networks. Moreover, this unit introduces Software Defined Networking (SDN), a new paradigm for conducting network management with programmability, flexibility and scalability.',
    assumed:
      'Students should be familiar with the fundamentals of computer networking and data communications. In particular, they should have a good understanding of the TCP/IP protocol suite, the OSI model, and current networking and internetworking technologies.',
    prerequisite: ['300095']
  },
  '300167': {
    name: 'Systems Programming 1',
    code: '300167',
    level: '2',
    credits: '10',
    coordinator: 'Chun Ruan',
    about:
      'This unit provides an introduction to the knowledge and skills required for the design, writing and support of technical software and other such functions normally falling within the role of the systems programmer. It provides for detailed study of a systems programming environment and its application to systems programming tasks.',
    assumed:
      'This unit requires a knowledge base of at least the level of a completed first year in a professional Computing degree.   Ability to apply fundamental concepts in data structures, algorithms, programming principles will be assumed.',
    prerequisite: ['300581']
  },
  '300252': {
    name: 'Advanced Topics in Networking',
    code: '300252',
    level: '7',
    credits: '10',
    coordinator: 'Seyed Shahrestani',
    about:
      'This unit focuses on the advanced features of networked systems and the emerging network technologies and services. The unit provides students with an in-depth understanding of relevant protocols, the emerging standards, and standards organisations. The emphasis of the unit is on development of the student skills to enable them to do proficient research and development works and studies in the computer networking discipline.',
    assumed:
      'Students should be familiar with the fundamentals of computer networking. In particular, students should have a good understanding of the OSI model, the TCP/IP protocol suite, and current Internet and networking technologies. Therefore, it is strongly advised that students must have either taken an appropriate unit in computer networking (e.g., 300695 Network Technologies), or have equivalent knowledge.'
  },
  '300255': {
    name: 'Network Management',
    code: '300255',
    level: '7',
    credits: '10',
    coordinator: 'Seyed Shahrestani',
    about:
      'The performance of any modern organization is heavily dependent on their networked systems and how these systems are managed. The increasing demand for ICT services and the huge growth of the Internet have resulted in large heterogeneous networks. This unit addresses the issues relevant to management of such networks and the services that run on them. It covers the principles and current practices pertinent to integrated management of networks, systems, and services. The unit helps the students to understand relevant protocols, standards, and standards organizations. It also introduces them to trends and key research areas in management of networked systems.',
    assumed:
      'Familiar with the fundamentals of computer networking and data communications.  In particular, a good understanding of the OSI model, the internet protocol suite and current internet technologies.',
    equivalent: ['54947']
  },
  '300256': {
    name: 'Multimedia Communication Systems',
    code: '300256',
    level: '7',
    credits: '10',
    coordinator: 'Mohammad Ahmadi',
    about:
      'This unit covers advanced concepts and technologies used in emerging multimedia communication systems. Theory, practice and standards for IT professionals endeavouring to build data compression systems for multimedia applications are emphasised.',
    assumed:
      'Basic knowledge in digital compression and coding, digital communication systems and fundamentals of data communication and networking.'
  },
  '300260': {
    name: 'IT Project Management',
    code: '300260',
    level: '7',
    credits: '10',
    coordinator: 'Bahman Javadi Jahantigh',
    about:
      'This unit is designed to provide students with an opportunity to learn and apply the knowledge, values and skills of consultancy, project management, and research by undertaking an IT project. The unit covers preparing and presenting project proposals in various ICT areas, project management, time management, communication skills, and the evolving legal, ethical, and social responsibilities of IT professionals. Students will work in teams under the supervision of a staff member, to plan and investigate their project.',
    assumed: 'Understanding of systems analysis and design principles.'
  },
  '300389': {
    name: 'Wireless Networking',
    code: '300389',
    level: '7',
    credits: '10',
    coordinator: 'Seyed Shahrestani',
    about:
      'Wireless technologies are amongst the most exciting and rapidly growing areas in computing and information technology.  They implement applications that profoundly impact our personal way of communication, as well as how business in a variety of industries and organisations are conducted.  This unit goes into details of such issues.  It discusses wireless networking technologies and their related applications.  The main features of wireless and mobile communication systems and the networked services that are based on these systems are also presented.  The unit provides students with an in-depth understanding of relevant protocols, the emerging standards and standard organisations.  The students are also introduced to some of the relevant current key research issues of the field.',
    assumed:
      'Students should be familiar with the fundamentals of computer networking and data communications.  In particular, they should have a good understanding of the OSI model, the Internet protocol suite and current internet and networking technologies equivalent to satisfactory completion of an introductory networking unit at the undergraduate level such as 300086 offered at Western Sydney University or one year professional experience in networking.\r\nThe unit is at an advanced level and students would not be able to complete the unit successfully unless they have a good understanding of fundamental issues in computer networking, Internet protocol suite and Internet technologies.'
  },
  '300404': {
    name: 'Formal Software Engineering',
    code: '300404',
    level: '3',
    credits: '10',
    coordinator: 'Yan Zhang',
    about:
      'This unit is concerned with the design, development and maintenance of computer software systems. The unit focuses on current formal specification and system verification technologies and methodologies. Foundations of model checking such as LTL and CTL, as well as a particular practical model checker SPIN will be thoroughly studied in this unit. The SPIN model checker with programming language PROMELA will be used for all software development and verification practices throughout this unit.',
    prerequisite: ['200025']
  },
  '300443': {
    name: 'Web Engineering',
    code: '300443',
    level: '7',
    credits: '10',
    coordinator: 'Athula Ginige',
    about:
      'Today organizations extensively rely on web based information systems to market, sell, manage customer relations, and for most of the internal operations. Users are increasingly using mobile devices to interact with this information. Due to rapidly changing business environment these systems need to be designed in away to accommodate the frequent changes. New technologies and frameworks have been developed to support development of large, complex, mobile based, maintainable and evolutionary web systems. In this unit students will study some of these technologies, design methods and frameworks that can be successfully used to engineer such web systems. They will get hands on experience by developing such a system.',
    assumed:
      'Ability to develop simple static web sites.  Knowledge about server-side and browser-side scripting.',
    equivalent: ['300251']
  },
  '300491': {
    name: 'Games Technology',
    code: '300491',
    level: '2',
    credits: '10',
    coordinator: 'Sharon Griffith',
    about:
      'This unit provides an introduction to the game industry as well as introducing students to the techniques of game design and construction.  Students will be exposed to the history of game development and the key aspects of different genres of computer games.',
    assumed:
      'A basic understanding of the principles of programming equivalent to Programming Principles 1.',
    equivalent: ['300162']
  },
  '300565': {
    name: 'Computer Networking',
    code: '300565',
    level: '2',
    credits: '10',
    coordinator: 'Sharon Griffith',
    about:
      'Computer Networking is an introductory unit in computer systems networking. It covers basic networking technologies, Ethernet fundamentals, ISO OSI model, routing, switching and subnetting, the Internet architecture, networking protocols including TCP/IP, important OSI layer 2 and 3 networking device fundamentals, basic network management and security issues. This unit is also the first of three units, which will prepare students for industry based networking certification (CCNA).',
    assumed:
      'Fundamentals of computer architecture, binary and hexadecimal numbering systems, and programming principles. They should also have a working knowledge of the World Wide Web.',
    equivalent: ['300094', '300086', '700012']
  },
  '300566': {
    name: 'Introduction to Health Informatics',
    code: '300566',
    level: '2',
    credits: '10',
    coordinator: 'Heidi Bjering',
    about:
      "This introductory unit aims to give the student an insight into the key knowledge and skill set required in the emerging domain of Health Informatics. Critical topics include: The Australian healthcare system, health care improvement modelling, health information systems and management, paper-based v's electronic health records, clinical documentation and data quality, health information management, consumer information security, privacy and ethics, decision support and clinical delivery support systems, healthcare data representation and interchange standards, telehealth and Information Communication technologies (ICT). This will be complemented by practical exercises and assessment support sessions. Through these experiences students will gain an understanding of the application of ICT to the healthcare domain and the skills necessary to play a pivotal role in the design and delivery of healthcare systems and  health information management.",
    assumed:
      'Familiarity with use of common business software, eg word proceesing, spreadsheets, database.',
    equivalent: ['700258']
  },
  '300569': {
    name: 'Computer Security',
    code: '300569',
    level: '3',
    credits: '10',
    coordinator: 'Tomas Trescak',
    about:
      'This unit aims in particular at, but is not limited to, the implementation and management of security and privacy policies of organisations within the standards and legal framework that is also applicable to the Australian standards.',
    assumed:
      'Students are expected to have general understanding on computer systems; computer fundamentals, databases, and web technologies.'
  },
  '300570': {
    name: 'Human-Computer Interaction',
    code: '300570',
    level: '3',
    credits: '10',
    coordinator: 'Omar Mubin',
    about:
      'A key component to the discipline of Information Systems is the understanding and the advocacy of the user in the development of IT applications and systems. IT graduates must develop a mind-set that recognizes the importance of users and organisational contexts. They must employ user centered methodologies in the development, evaluation, and deployment of IT applications and systems. This unit examines human-computer interaction in order to develop and evaluate software, websites and information systems that not only look professional but are usable, functional and accessible.',
    equivalent: ['300160']
  },
  '300572': {
    name: 'Information Systems Deployment and Management',
    code: '300572',
    level: '3',
    credits: '10',
    coordinator: 'Ana Hol',
    about:
      "This unit provides a detailed overview of system implementation and deployment stages taking into consideration the steps that are necessary to place a newly developed system into production. In this unit students learn the skills required for accurate requirements gathering, timely and effective system development, and successful implementation that would result in effective system performance. For this to be achieved successfully this unit also addresses the importance of project management skills. The unit also highlights the issues of transition processes after the development phase, the activities required in systems support and maintenance in the system's operational stage.",
    assumed:
      'A general understanding of various Information Systems in the eBusiness environment - familiarity with information system development processes',
    prerequisite: ['300580'],
    equivalent: ['300272']
  },
  '300573': {
    name: 'Information Systems in Context',
    code: '300573',
    level: '1',
    credits: '10',
    coordinator: 'Ana Hol',
    about:
      'This unit aims to give students the ability to recognise and explain business information systems with regard to type, function, purpose, and the frameworks within which these systems are used.  Topics in this unit include computing fundamentals; computer hardware and software; computers and society; use of business application packages - spreadsheets,  word processing, database, graphics; organisational information systems;   information systems development and acquisition; data and knowledge management; electronic commerce, internets, extranets;  networking; enterprise-wide information systems; the internet and information systems security; privacy, ethics and computer crime.',
    assumed: '2 Unit Mathematics and 2 Unit English (General)',
    equivalent: ['700000'],
    incompatible: ['200128']
  },
  '300575': {
    name: 'Networked Systems Design',
    code: '300575',
    level: '3',
    credits: '10',
    coordinator: 'Ain De Horta',
    about:
      'This unit builds on and consolidates the skills and knowledge gained in  Computer Networking and Computer Networks and Internets. Students successfully completing this unit will acquire the necessary design skills and knowledge required to build and configure enterprise scale networks. The unit provides students with an opportunity to develop problem-solving techniques and decision-making skills to resolve networking issues. Students completing this unit and its prerequisites should also now be prepared to attempt world recognized network industry certification (CCNA).',
    prerequisite: ['300095'],
    equivalent: ['300088']
  },
  '300578': {
    name: 'Professional Development',
    code: '300578',
    level: '3',
    credits: '10',
    coordinator: 'Heidi Bjering',
    about:
      'This is a final year unit that builds on foundation and intermediate computing units to prepare students for professional experience. The unit covers the content in three modules as 1) Ethics and Professional Code of Conduct,  2) Project Management, and 3) Legal, Social, Environmental issues, Quality Assurance and IT Compliance. The content covered in these three modules are carefully designed to fill in the gaps in knowledge that is not so far covered in previous units in preparing students for the challenging projects units and professional working life ahead. This unit is a pre-requisite to the capstone project, covered in Professional Experience Project unit.',
    assumed: 'Understanding of systems analysis and design.',
    equivalent: ['300372']
  },
  '300579': {
    name: 'Professional Experience',
    code: '300579',
    level: '3',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      "Professional Experience is a final year 'capstone' project unit. This unit provides opportunities for students to gain hands-on experience in software systems requirements definition, analysis, design and implementation, in a real-world setting. Students work in groups, guided by an academic supervisor or an industry mentor, in achieving the goals set by the client that provides the project. Suitable projects are sourced from external organisations or within Western Sydney University by way of giving the students professional experience in independent learning and reflective practice.",
    assumed:
      'Software development methodologies; Software analysis and design modelling tools and techniques; Programming languages; Implementing databases management systems; Software construction and testing.',
    prerequisite: ['300104'],
    equivalent: ['300097']
  },
  '300580': {
    name: 'Programming Fundamentals',
    code: '300580',
    level: '1',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'As a first unit in computer programming, Programming Fundamentals covers the basics of developing software with an emphasis on procedural programming. Students will learn about basic data structures, the concept of algorithms, fundamental programming constructs, common programming language features and functions, program design and good programming style. A high level programming language is combined with a highly visual framework to teach problem solving using software.',
    assumed: 'High school mathematics at Year 10 level.',
    equivalent: ['300405', '300155', '200122', '700008']
  },
  '300581': {
    name: 'Programming Techniques',
    code: '300581',
    level: '2',
    credits: '10',
    coordinator: 'Paul Davies',
    about:
      'This unit is intended as a second unit of study in programming. It builds on a basic understanding of procedural programming as would be developed in a first unit. This unit continues the development of programming skills and methodologies required for professional programming and for further study in later computing units. Topics covered include multi-dimensional arrays, file I/O, searching and sorting, and an introduction to object-oriented programming involving classes and inheritance.',
    prerequisite: ['300580'],
    equivalent: ['300156', '700257'],
    incompatible: ['300903']
  },
  '300582': {
    name: 'Technologies for Web Applications',
    code: '300582',
    level: '2',
    credits: '10',
    coordinator: 'Paul Davies',
    about:
      'Building on material covered in Programming Fundamentals this unit introduces students to some of the key technologies for developing interactive and dynamic web applications from both the client and server perspective. The unit covers web site design, web site development, web page accessibility and usability, HTML, CSS, client side and server side scripting, database interaction, web site promotion (Search Engine Optimisation) and web security.',
    assumed:
      'Basic programming principles and program control structures equivalent to that covered in Programming Fundamentals. Basic file management and PC operation including how to access and search the World Wide Web.',
    prerequisite: ['300580'],
    equivalent: ['300129'],
    incompatible: ['300101']
  },
  '300583': {
    name: 'Web Systems Development',
    code: '300583',
    level: '3',
    credits: '10',
    coordinator: 'Weisheng Si',
    about:
      'In this unit students further develop their theoretical and practical skills in designing and developing web based information systems using systems analysis, programming, database, human computer interaction and web technologies skills that they have learnt in previous units. Current web development technologies and/or frameworks will be utilised to build a complex web information system in a collaborative web development team. Techniques of porting web systems to mobile platforms will also be explored.',
    assumed:
      '- Fundamental web development skills such as HTML, CSS, Javascript and PHP.\r\n- Principles of relational database design and development, practical skills in SQL.\r\n- Principles of systems analysis and design including the specification of end-user requirements and a good knowledge of the SDLC and its application to solving computer system related problems.',
    prerequisite: ['300582'],
    equivalent: ['300085']
  },
  '300584': {
    name: 'Emerging Trends in Information Systems',
    code: '300584',
    level: '3',
    credits: '10',
    coordinator: 'Ana Hol',
    about:
      'This unit provides a means for students to self-reflect on their future career and their possible involvement in the field of Information Systems and explore the changing nature of information systems in organisations via one of the following:  engagements with local businesses, specifically crafted study tours or focused internships.  In this unit students will study the role that emerging technologies play in selection, design and development of information systems. Students will be able to research and assess new technologies while networking and engaging with real life businesses, as well as develop and introduce effective strategies for achieving change and improvement that can be delivered by successfully implementing emerging technologies.',
    prerequisite: ['300573']
  },
  '300585': {
    name: 'Systems Analysis and Design',
    code: '300585',
    level: '1',
    credits: '10',
    coordinator: 'Simi Kamini Bajaj',
    about:
      'This unit introduces the concepts of System Analysis and Design. The study of methodologies and techniques for problem recognition, requirement analysis, process modelling and/or data modelling are essential elements of this unit. The Systems Development Life Cycle model is employed as the prime approach to teach the unit, providing students with the basic skills required for analysis and design of logical solutions to information systems problems. The use of Computer Aided System Engineering tools will be discussed in practical sessions.',
    assumed:
      'Students should have knowledge of the fundamentals of information systems, computer systems, computer applications and information processing',
    equivalent: ['300131']
  },
  '300586': {
    name: 'Advanced Computer Science Activities 1',
    code: '300586',
    level: '1',
    credits: '0',
    coordinator: 'Yun Bai',
    about:
      'This unit is only for Bachelor of Computer Science (Advanced) students in year one of their studies. Students will participate in industry and research based extension activities (non-assessable). These activities will be identified with the goal of exposing students early in their degree and integrating them into a culture of academic enquiry, problem solving, knowledge generation and scholarship and an awareness of the challenges and current issues confronting the computing/IT industry. The unit will be used to record student activities and a satisfactory/ unsatisfactory grade will be applied at the end of each semester.'
  },
  '300587': {
    name: 'Advanced Computer Science Activities 2',
    code: '300587',
    level: '2',
    credits: '0',
    coordinator: 'Yun Bai',
    about:
      'This unit is only for Bachelor of Computer Science (Advanced) students in year two of their studies. Students will participate in industry and research based extension activities (non-assessable). These activities will be identified with the goal of exposing students early in their degree and integrating them into a culture of academic enquiry, problem solving, knowledge generation and scholarship and an awareness of the challenges and current issues confronting the computing/IT industry. The unit will be used to record student activities and a satisfactory/ unsatisfactory grade will be applied at the end of each semester.'
  },
  '300588': {
    name: 'Advanced Computer Science Activities 3',
    code: '300588',
    level: '3',
    credits: '0',
    coordinator: 'Yun Bai',
    about:
      'This unit is only for Bachelor of Computer Science (Advanced) students in year three of their studies. Students will participate in industry and research based extension activities (non-assessable). These activities will be identified with the goal of exposing students early in their degree and integrating them into a culture of academic enquiry, problem solving, knowledge generation and scholarship and an awareness of the challenges and current issues confronting the computing/IT industry. The unit will be used to record student activities and a satisfactory/ unsatisfactory grade will be applied at the end of each semester.'
  },
  '300672': {
    name: 'Mathematics 1A',
    code: '300672',
    level: '1',
    credits: '10',
    coordinator: 'Charles Zworestine',
    about:
      'This Level 1 unit provides a solid foundation in the theory and applications of differential calculus, as well as some introductory work on complex numbers.  It is the first of two units developing aspects of calculus.',
    assumed:
      'Mathematics achieved at Bands 5-6, or knowledge equivalent to 300830 Analysis of Change.',
    equivalent: ['200189'],
    incompatible: ['200031', '200237']
  },
  '300673': {
    name: 'Mathematics 1B',
    code: '300673',
    level: '1',
    credits: '10',
    coordinator: 'Alexander Lee',
    about:
      'This Level 1 unit provides a solid foundation in the theory and applications of integral calculus, as well as some introductory work on linear algebra and infinite sequences and series.  It is the second of two units developing aspects of calculus.',
    prerequisite: ['300672'],
    equivalent: ['200189'],
    incompatible: ['200031', '200237']
  },
  '300693': {
    name: 'Web Technologies',
    code: '300693',
    level: '7',
    credits: '10',
    coordinator: 'Zhuhan Jiang',
    about:
      'This unit covers the technologies required for the construction and maintenance of web pages and web sites. It focuses on the web page and site design, markup languages, client-side technologies such as Cascading Style Sheets and Javascript, as well as server-side technologies such as web servers, database connectivity, and server side scripting. It also includes the use of multi-media, security, access rights, and the exploration of some of the latest technological wonders populated on the Internet. This unit is heavily orientated towards practical experience based on amplifying the theoretical concepts.'
  },
  '300694': {
    name: 'Advanced Topics in ICT',
    code: '300694',
    level: '7',
    credits: '10',
    coordinator: 'Tomas Trescak',
    about:
      'The information and communications technologies are advancing at an ever-increasing rate. The whole world is now interconnected. The World Wide Web community is actively engaged in developing the next generation of the Web. Social networking on the Internet is facilitated by the latest developments such as Facebook, YouTube and MySpace. Artificial Intelligence is increasingly intertwined with the decisions we make every day. Large scale storage technologies are leading to Cloud Computing where data and applications may reside anywhere in the world. Research in how to access meaningful data from the vast amounts on the Web has led to initiatives such as Semantic Web and Linked Data. Mashups mix data from disparate sources to enable users to work more efficiently. Wireless and mobile computing are changing the market place. All of these trends are still in their early stages. To make sense of all these developments, the top echelons of the World Wide Web Consortium are actively engaged in creating a new discipline called Web Science. Advanced Topics in ICT will enable the students to appreciate the scale of new developments and create prototypes of applications in their desired ambit. This unit consists of three Topics selected each semester. Assessment will be by a series of discussion paper assignments  here students will show they have met the unit learning outcomes.',
    prerequisite: ['301005']
  },
  '300695': {
    name: 'Network Technologies',
    code: '300695',
    level: '7',
    credits: '10',
    coordinator: 'Aruna Jamdagni',
    about:
      'Computer networking is one of the fastest growing technologies of our time. The Internet interconnects billions of computers providing many new exciting opportunities and challenges. The Internet and the World Wide Web have provided the communication and infrastructure needed for global collaboration and information exchange. As a result of the rapid growth of networked systems and the diverse applications that run on them, success in many professions depends on a sound understanding of the technologies underlying these systems and applications. This unit explores these issues and provides the students with such an understanding. It covers the principles and current practices pertinent to computer networking and communications. It describes some of the important technologies and devices used in modern networks for information distribution and data sharing. The unit helps the students to understand important models, protocols and standards in networking and internetworking.',
    assumed:
      'The students should be familiar with the fundamentals of computer architecture and programming principles. They should also have a working knowledge of the World Wide Web.',
    equivalent: ['300254']
  },
  '300696': {
    name: 'Systems and Network Security',
    code: '300696',
    level: '7',
    credits: '10',
    coordinator: 'Hon Cheung',
    about:
      'This unit is concerned with the protection of information in computing systems and when transferred over networks.  It addresses techniques for securing networking applications and their security arrangements. Students gain an understanding of the fundamentals of the provision of security in networks and systems, as well as an appreciation of some of the problems that arise in devising practical security solutions.',
    assumed:
      'Basic knowledge of networked and computer systems.  Basic understanding of cryptography.',
    equivalent: ['300253']
  },
  '300697': {
    name: 'Content Management Systems and Web Analytics',
    code: '300697',
    level: '7',
    credits: '10',
    coordinator: 'Hanh Nguyen Vo',
    about:
      "Content management systems (CMS) is a collective name for a wide range of web applications used by organisations/institutions/enterprises and social communities in establishing a continuing web presence.  They may connect to backend systems and can provide complete web application services.  This unit builds on both the conceptual and practical skills/knowledge to develop and utilise CMS's; in their management; in technical, legal, ethical and security issues; and in utilising web analytics to obtain business intelligence of their operation and impact.",
    assumed: 'Web development and HTML basics.',
    equivalent: ['300264']
  },
  '300698': {
    name: 'Operating Systems Programming',
    code: '300698',
    level: '3',
    credits: '10',
    coordinator: 'Evan Crawford',
    about:
      'This unit provides the knowledge of the internal structure and functionality of Operating Systems.  An operating system defines an abstraction of hardware behavior and provides a range of services more suitable for ICT application development than what raw hardware could deliver, in terms of convenience, efficiency and security. It is important that ICT Professionals have some understanding of how these services are realized. For ICT Professionals whose role includes supporting the operating system this unit provides the introduction to the relevant theory and practice.',
    assumed:
      'Students are expected to have a general understanding on computer systems; computer fundamentals, and programming techniques.',
    prerequisite: ['300581'],
    equivalent: ['300149'],
    incompatible: ['300943']
  },
  '300699': {
    name: 'Discrete Structures and Complexity',
    code: '300699',
    level: '2',
    credits: '10',
    coordinator: 'Volker Gebhardt',
    about:
      'The fact that computers work at all in the way they do is due to the formal mathematical structure that is used in their design. The same holds for establishing important matters such as the reliability of our computer networks. This unit presents, in their computing context, a range of mathematical concepts that are essential for understanding a number of topics concerning computers: the ways they work, they ways they interact, and the ways we interact with them.',
    assumed: 'Basic programming such as that in 300580 - Programming Fundamentals.',
    prerequisite: ['300700'],
    incompatible: ['200025']
  },
  '300700': {
    name: 'Statistical Decision Making',
    code: '300700',
    level: '1',
    credits: '10',
    coordinator: 'Volker Gebhardt',
    about:
      'Statistical Decision Making introduces students to various statistical techniques supporting the study of computing and science.  Presentation of the content will emphasize the correct principles and procedures for collecting and analysing scientific data, using information and communication technologies.    Topics include describing different sets of data, probability distributions, statistical inference,  and simple linear regression and correlation.',
    equivalent: ['200192', '200263', '200032', '200052', '301123', '700007', '700033', '700041'],
    incompatible: ['200182']
  },
  '300743': {
    name: 'Mathematics for Engineers Preliminary',
    code: '300743',
    level: '1',
    credits: '10',
    coordinator: 'Donald Shearman',
    about:
      'This unit is specifically designed for students enrolling in the Bachelor of Engineering (Honours) and Bachelor of Engineering Science degree courses, who do not have a mathematical background in differential and integral calculus.  The content of the unit consists of topics in arithmetic and algebra, trigonometry and trigonometric functions, logarithmic and exponential functions, differential and integral calculus.',
    equivalent: ['700100', '700103'],
    incompatible: ['200195', '200191', '200237', '700019']
  },
  '300770': {
    name: 'Software Testing and Automation',
    code: '300770',
    level: '7',
    credits: '10',
    coordinator: 'Simi Kamini Bajaj',
    about:
      'Software Testing and Automation will cover topics in two sections - Fundamentals of Software Testing and Test Automation.  Section 1 will enable students to get a good understanding of different types of testing, the entire life cycle of Testing; how to design and prepare Test Cases, Test Data, execute these Test Cases and manage the defects. Students will also learn the importance of exclusive Test Environment for Testing and how to create a Traceability Matrix relating Requirements to Test Cases. Since approaches to testing software have also evolved with rigorous systematic approaches and advanced tools to automate some of the testing tasks.  Section 2 will expose students to Test Automation using an automation tool, Object mapping and repository creation, Exception handling, logging and reporting, and Creation and Execution of Automation scripts.',
    assumed:
      'Knowledge about:  Software Development Life Cycle; Programming knowledge in one of the Object Oriented programming language  for e.g. Java, C++; Scripting Language such as Java Script'
  },
  '300830': {
    name: 'Analysis of Change',
    code: '300830',
    level: '1',
    credits: '10',
    coordinator: 'Shatha Aziz',
    about:
      'This Level 1 unit introduces students to the mathematical modelling techniques that are used to formulate and solve problems in the physical and biological sciences. To use these techniques successfully, students must develop the ability to formulate a problem mathematically and then be able to use the appropriate knowledge to test conclusions by analytical and numerical means. These skills will be emphasized as each technique in introduced. Apart from some introductory work on logarithms and exponentials (essential concepts in the sciences), the main techniques developed involve aspects of differential calculus, culminating in the use of differential equations to model real phenomena in the sciences.',
    assumed:
      'General Mathematics background achieved at bands 5 or 6, or Mathematics, achieved at band 4, or equivalent or 300831 Quantitative Thinking.',
    equivalent: ['200191'],
    incompatible: ['300672']
  },
  '300831': {
    name: 'Quantitative Thinking',
    code: '300831',
    level: '1',
    credits: '10',
    coordinator: 'Stephen Weissenhofer',
    about:
      'This level 1 unit develops the quantitative skills that underpin many fields of study in the sciences. The content covered includes basic algebra, functions, graphs, equations, linear and quadratic, introductory probability and descriptive statistics. These mathematical/statistical concepts will be revised and developed using scientific concepts such as molarity and dilution, optical density, population growth, and predator-prey models. In all aspects of this unit, students will be developing and using critical thinking skills to solve mathematical/statistical problems set in a scientific context.',
    assumed:
      'Basic competence in algebraic manipulation and some familiarity with elementary probability and statistical concepts.',
    equivalent: ['200191']
  },
  '300862': {
    name: 'Video Games Development',
    code: '300862',
    level: '3',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'This unit provides students with an in-depth understanding of the development and structure of game engines. It provides the student with a unifying overview of the many modules that are incorporated in a game engine as well as a detailed examination of game-play and engine programming.',
    assumed:
      'Understanding of programming concepts and details of programming. Good programming skills in C#, Java or C++. Knowledge of systems analysis methods including object orientated analysis and design. Basic knowledge of vector algebra, matrixes and fundamentals of mathematics.',
    prerequisite: ['300580'],
    equivalent: ['300492']
  },
  '300888': {
    name: 'Object Oriented Analysis (Advanced)',
    code: '300888',
    level: '2',
    credits: '10',
    coordinator: 'Jiansheng Huang',
    about:
      'The core strength of this unit, as the advanced version of 300144 Object Oriented Analysis, is to analyse and model business objectives and critical requirements of software systems to be developed using object-oriented (OO) approaches. The system analysis is taken to greater depths within the context of Object Orientation. The Unified Modelling Language version 2.0 (notably use cases, user case diagrams, activity diagrams, class diagrams and sequence diagrams) is used as the modelling standard for creating OO models in the problem, solution and background modeling spaces. The unit also covers the rational unified process methodology and applications of design patterns for software development through real world case studies.',
    assumed:
      'General understanding of what an information system is and how information systems development is undertaken and\r\n•\t Introductory knowledge about system analysis and design, including \r\n- basic problem solving experience in computerised information systems\r\n- ability to derive systems requirements from problem definitions\r\n- ability to produce system models using process, data, object and network modelling.\r\n- understanding design and implementation issues include, (but may not be limited to), elementary database design, input, output and user interface design and prototyping.\r\n•\t General knowledge on programming languages\r\n- Understanding difference between procedure programming  and object oriented programming   \r\n- Introductory knowledge of classes and objects and class construction\r\n- Introductory knowledge on object orientation, including encapsulation, inheritance and polymorphism.',
    prerequisite: ['300585'],
    incompatible: ['300144']
  },
  '300900': {
    name: 'Professional Experience (Advanced)',
    code: '300900',
    level: '3',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      "Professional Experience (Advanced) is a final year 'capstone' work-placement unit. This  advanced  unit  provides  the  opportunity  for  students  to  gain  hands-on experience in software systems requirements definition, analysis, design, implementation and project management, in an external organisation under the supervision of industry experts. During the work placement students work in a real- life project applying the theories and technical skills learned in previous units in an industry setting. Students are allowed to propose a work-placement of their choice within an external organisation. School will assess the suggested work-placement for its suitability in meeting the set unit outcomes, prior to approval.",
    assumed:
      'Software development methodologies; Software analysis and design modelling tools and techniques; Programming languages; Implementing databases management systems; Software construction and testing; System documentation; Project Management',
    prerequisite: ['300104'],
    incompatible: ['300098']
  },
  '300901': {
    name: 'Human-Computer Interaction (Advanced)',
    code: '300901',
    level: '3',
    credits: '10',
    coordinator: 'Omar Mubin',
    about:
      'IT graduates must be able to develop and evaluate software, websites and mobile apps that not only look professional but are usable, functional and accessible. However, the study of HCI is often restricted to its use as a tool in the software development process. This advanced unit also examines HCI as a field of research and how to conduct research into human user factors. Students in this advanced unit will be required to complete a research project and produce a final research report, which is of a standard capable of being considered for publication in a HCI conference or journal.',
    incompatible: ['300570', '300160']
  },
  '300902': {
    name: 'Web Systems Development (Advanced)',
    code: '300902',
    level: '3',
    credits: '10',
    coordinator: 'Weisheng Si',
    about:
      "This unit teaches state-of-the-art web frameworks for developing complex web systems. This unit utilises the skills of basic web programming, database design, and systems analysis that students have learnt in previous units. Major topics in this unit include Cascading Style Sheet (CSS) framework, Razor pages, Model-View-Controller (MVC) programming, object to relational database mapping, and authentication and authorization. Moreover, this unit trains students' collaborative skills by asking students to build a complex website in a small team. As an advanced unit, deeper topics such as custom data validation and error handling will be discussed.",
    assumed:
      '- Fundamental web development skills such as HTML, CSS, Javascript and PHP.\r\n- Principles of relational database design and development, practical skills in SQL.\r\n- Principles of systems analysis and design including the specification of end-user requirements and a good knowledge of the SDLC and its application to solving computer system related problems.',
    prerequisite: ['300582'],
    incompatible: ['300583']
  },
  '300903': {
    name: 'Programming Techniques (Advanced)',
    code: '300903',
    level: '2',
    credits: '10',
    coordinator: 'Paul Davies',
    about:
      'This unit is intended as a second unit of study in programming. It builds on a basic understanding of procedural programming as would be developed in a first unit. This unit continues the development of programming skills and methodologies required for professional programming and for further study in later computing units. Topics covered include multi-dimensional arrays, file I/O, searching and sorting, and an introduction to object-oriented programming involving classes and inheritance. Students in this advanced unit will also investigate and apply advanced concepts such as function overloading and recursion.',
    prerequisite: ['300580'],
    incompatible: ['300581']
  },
  '300941': {
    name: 'Database Design and Development (Advanced)',
    code: '300941',
    level: '2',
    credits: '10',
    coordinator: 'Zhuhan Jiang',
    about:
      'This unit covers the principles, methodologies and technologies for the database design and development, exploring in particular the data modelling methods and the use of the language SQL for the database applications. The unit also examines a number of important database concepts such as database administration, concurrency, backup and recovery, and security. Students in this advanced unit are furthermore required to investigate new technological and theory advances in the database industry and apply them to the solution of concrete database problems.',
    assumed:
      'Basic programming skills, including variable declaration, variable assignment, selection statement and loop structure.',
    incompatible: ['200129', '300104']
  },
  '300942': {
    name: 'Emerging Trends in Information Systems (Advanced)',
    code: '300942',
    level: '3',
    credits: '10',
    coordinator: 'Ana Hol',
    about:
      'This unit provides a means for students to self-reflect on their future career and their possible involvement in the field of Information Systems. In this advanced unit students will be required to undertake an individual but closely supervised research project.  Students will explore the changing nature of information systems in organisations via one of the following:  engagements with local businesses, specifically crafted study tours or focused internships.  In this unit students will study the role that emerging technologies play in selection, design and development of information systems. Students will be able to research and assess new technologies while networking and engaging with real life businesses, as well as develop and introduce effective strategies for achieving change and improvement that can be delivered by successfully implementing emerging technologies.  In addition, students in this unit will be required to present their findings in a form of an academic paper with a possibility of publishing.',
    prerequisite: ['300573'],
    incompatible: ['300584']
  },
  '300943': {
    name: 'Operating Systems Programming (Advanced)',
    code: '300943',
    level: '3',
    credits: '10',
    coordinator: 'Evan Crawford',
    about:
      'This unit provides the knowledge of the internal structure and functionality of Operating Systems. Through the use of case studies the abstraction that Operating Systems provide will be investigated, and techniques for programming with these abstractions will be developed.',
    prerequisite: ['300903'],
    incompatible: ['300689', '300149']
  },
  '300946': {
    name: 'Computer Networking (Advanced)',
    code: '300946',
    level: '2',
    credits: '10',
    coordinator: 'Sharon Griffith',
    about:
      'This unit introduces students to computer systems networking. It covers basic networking technologies, Ethernet fundamentals, ISO OSI model, routing, switching and subnetting, the Internet architecture, networking protocols including TCP/IP, important OSI layer 2 and 3 networking device fundamentals, basic network management and security issues. This unit is also the first of three units, which will prepare students for industry based networking certification (CCNA). Students in this advanced unit will be required to undertake individual assessment activities demonstrating a high level of technical and applied theoretical competency.',
    assumed:
      'Fundamentals of computer architecture, binary and hexadecimal numbering systems, and programming principles. A working knowledge of the World Wide Web.',
    incompatible: ['300094', '300086', '300565']
  },
  '300950': {
    name: 'Fundamentals of Medical Concepts and Terminology',
    code: '300950',
    level: '2',
    credits: '10',
    coordinator: 'Jim Basilakis',
    about:
      'This unit is designed to provide the student with the knowledge necessary to understand the information contained in the health record, to function in a medical environment through an understanding of the fundamentals of medicine and to effectively use disease classification systems. Within each body system, the student will study anatomy and physiology, disease processes and their treatment, and medical terminology (disease titles, symptomatic terms, surgical terms and investigations). The unit will also focus on specialist topics such as mental health, obstetrics, paediatrics, infectious diseases, oncology, radiotherapy, nuclear medicine, diagnostic and surgical interventions.',
    prerequisite: ['300566']
  },
  '300951': {
    name: 'Clinical Classification and Coding',
    code: '300951',
    level: '2',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      'This unit is designed to enable the student to classify diseases and interventions using the current version of the International Statistical Classification of Diseases and Related Health Problems, Tenth Revision, Australian Modification, the Australian Classification of Health Interventions and the Australian Coding Standards (ICD-10-AM/ACHI/ACS). The unit will also include the historical development of clinical classification systems as well as the purpose and value of classifying diseases and interventions within the health system. The student will become familiar with the structure and content of ICD-10-AM ACHI/ACS and be introduced to the rules and conventions associated within ICD-10-AM/ACHI. The primary ACS for ICD-10-AM/ACHI will be studied and applied when coding from line diagnoses/interventions, case studies, simple discharge summaries and clinical record reports. They will gain skills in data abstraction for clinical coding, specifically, the selection of principal and additional diagnoses and interventions.',
    prerequisite: ['300950']
  },
  '300952': {
    name: 'Wireless and Mobile Networks',
    code: '300952',
    level: '3',
    credits: '10',
    coordinator: 'Rodrigo Neves Calheiros',
    about:
      'This unit helps the students gain in depth knowledge in the core concepts and principles in the areas of wireless and cellular networks. It provides them with the technical skills needed to do requirement analysis and evaluate a range of wireless networked systems to plan their institution or expansion. The unit covers the communication characteristics and architecture of wireless systems along with various types of wireless networks, including wireless LANs, personal area networks, sensor networks, mesh networks, and broadband wireless networks. Given the widespread use of mobile phones and devices, a substantial part of the unit is devoted to the study of cellular networks. The unit also covers mobility management and wireless security issues and solutions. Upon completion of this unit, the students will have the capabilities needed for long term and independent learning in the rapidly evolving area of wireless and mobile networking.',
    prerequisite: ['300565'],
    equivalent: ['300088']
  },
  '300953': {
    name: 'Advanced Clinical Classification',
    code: '300953',
    level: '3',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      'In this unit, the student will be introduced to disease notification and registration procedures. Mortality or cause of death coding will also be examined.Concepts of organising health information in a logical way to interface with an electronic information system will be investigated. The design and role of various health classification systems including the World Health Organizations Family of International Classifications (WHO FIC), specifically ICD 11 and casemix classification systems (e.g. AR DRGs, AN SNAP) will also be discussed. The practical component of this unit will focus on the student further developing their classification skills in the more complex areas of clinical coding including endocrine disorders, specifically diabetes mellitus, circulatory diseases and interventions, genitourinary disorders, specifically chronic kidney disease, obstetrics, paediatrics and congenital anomalies and trauma and procedural complications. The ACS will be applied in detail when classifying from complex discharge summaries and full clinical episodes of care. The student will also be exposed to electronic clinical coding tools that can be used in the classification process.',
    prerequisite: ['300951']
  },
  '300954': {
    name: 'Activity Based Funding/Casemix and Data Quality',
    code: '300954',
    level: '3',
    credits: '10',
    coordinator: 'Jim Basilakis',
    about:
      'This unit will introduce students to Activity Based Funding and Casemix within the Australian healthcare system. It is designed to cover a variety of casemix classification systems for acute, non-admitted, sub-acute and mental health patients. Attention will be given to Diagnosis Related Groups (DRGs) with specific reference to the Australian Refined Diagnosis Related Groups (AR-DRGs) and the relationship to Activity Based Funding and purchasing models. Measuring performance with activity data and clinical costing methods will be explored. Emphasis will be placed on the impact of data quality as a critical component in achieving excellence in clinical costing, casemix and patient safety.',
    assumed: 'Medical terminology and clinical classification',
    prerequisite: ['300951']
  },
  '300955': {
    name: 'Healthcare Data Environments',
    code: '300955',
    level: '3',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      'This unit extends the student’s knowledge of Health Informatics by introducing concepts relating to electronic communications within the health industry. It exposes students to a variety of environments used to create, store, transfer and deliver healthcare data. Areas include minimum data sets, data linkage, messaging concepts/standards, terminologies, healthcare evaluation, electronic health records and related standards, security, privacy and trust, medico legal, epidemiology and population health together with TeleHealth/ TeleMedicine approaches, methodologies, tools and techniques.',
    prerequisite: ['300566'],
    equivalent: ['300567']
  },
  '300956': {
    name: 'Healthcare Software and Systems',
    code: '300956',
    level: '3',
    credits: '10',
    coordinator: 'Jim Basilakis',
    about:
      'In this unit students will learn the concepts underpinning the services computing paradigm of "bridging the gap between Business Services and IT Services". Services Computing technology includes Web services and serviceoriented architecture (SOA), business consulting methodology and utilities, business process modelling, transformation and integration. Students will learn, through the development of practical examples, how to utilise these technologies within a healthcare context',
    prerequisite: ['300566'],
    equivalent: ['300568']
  },
  '300958': {
    name: 'Social Web Analytics',
    code: '300958',
    level: '3',
    credits: '10',
    coordinator: 'Gizem Intepe',
    about:
      'The Social Web provides everyone with a voice, information from Facebook, Twitter and Google+ should allow us to identify trends and relationships in society. Whilst this has interest on a personal level, the killer-apps will be in analysing such data for business; tracking the buzz around a new product, understanding the links between customers etc. This unit will introduce its students to the Social Web data that is available, and blend computational, mathematical and statistical concepts to allow extraction and analysis of such data.',
    assumed: 'Students are expected to be familiar with fundamental computer programming concepts.',
    rawPrerequisite: [
      'For students not enrolled in 3734 Bachelor of Data Science: 300700 Statistical Decision Making or 200263 Biometry or 200032 Statistics for Business'
    ]
  },
  '300960': {
    name: 'Mobile Applications Development',
    code: '300960',
    level: '3',
    credits: '10',
    coordinator: 'Quang Vinh Nguyen',
    about:
      'This unit teaches technologies and programming languages for developing applications on common mobile platforms, such as Android and iOS. Students will learn skills for developing programs on the above platforms, along with in-class sample applications that highlight platform-specific implementation details.',
    rawPrerequisite: [
      'For students enrolled in 3687 Bachelor of Information Systems, 3688 Bachelor of Information Systems Advanced, 3744 Bachelor of Information Systems/Bachelor of Business, 3745 Bachelor of Information Systems Advanced/Bachelor of Busines,  6036 Diploma in Information and Communications Technology/Bachelor of Information Systemss or 6040 Diploma in Information and Communications Technology/Bachelor of Information Systems - 300582 Technologies for Web Applications',
      'For students enrolled in 3639 Bachelor of Information and Communications Technology - 300581 Programming Techniques',
      'For students enrolled in 3684 Bachelor of Information and Communications Technology (Advanced)- 300903 Programming Techniques (Advanced)',
      'For students enrolled in 3506 Bachelor of Computer Science - 300147 Object Oriented Programming OR 300582 Technologies for Web Applications'
    ]
  },
  '300961': {
    name: 'Social Computing',
    code: '300961',
    level: '3',
    credits: '10',
    coordinator: 'Athula Ginige',
    about:
      'Rapid growth of computational devices connected to the internet such as mobile phones, tablets, personal computers have made us into a digitally connected society. This has enabled us to develop a new computing paradigm: Social Computing to enhance ways we can fulfil a range of primary and secondary human needs. Already many new businesses have evolved making use of these possibilities surpassing the number of users in corresponding conventional businesses such as retail, transportation and hotel chains. In this unit you will learn the fundamental concepts of Social Computing, how Social Computing is evolving, explore interaction models of social networks, analyse a few reported cases that relate to social computing in detail to understand the impact on society and businesses, and explore ways to enhance a range of livelihood activities and future possibilities. This unit will also cover underpinning technologies related to social computing such as Web 2.0, knowledge management and related security and privacy issues.'
  },
  '300962': {
    name: 'Applied Business Statistics',
    code: '300962',
    level: '7',
    credits: '10',
    coordinator: 'Kenan Matawie',
    about:
      'This unit introduces the basic statistical concepts and techniques for descriptive and inferential data analysis. It will aid and improve business decision-making, especially when faced with uncertain outcomes.',
    assumed: 'Mathematics to the HSC level'
  },
  '300966': {
    name: 'The Cosmos in Perspective: Information and Life',
    code: '300966',
    level: '2',
    credits: '10',
    coordinator: 'Ain De Horta',
    about:
      'Across the world and across history, humans have wondered about the universe, its history and evolution.\r\nFrom the Big Bang to the end of the Universe, from our own Solar System to the farthest superclusters of galaxies, our knowledge and understanding of the Universe in which we live is growing at an amazing rate. In this unit, we survey the cosmos from two different perspectives relating to complexity: The perspectives of Information and Life. From the information perspective, we examine the growth of complexity and structure in the universe, and consider the uses of information theory to understand cosmic evolution. We know that Life exists in the Universe, but know little about how common it might be - we consider the requirements for life to exist and the possibility of other life in the Universe by examining the cosmos at scales from planets to the universe. We consider cultural perspectives on the cosmos, including that of indigenous Australians. This unit is non-technical and is suitable as an introductory unit for students in computing, engineering and science, and as a general education unit for students in all other areas.'
  },
  '300976': {
    name: 'Technologies for Mobile Applications',
    code: '300976',
    level: '2',
    credits: '10',
    coordinator: 'Evan Crawford',
    about:
      'This unit introduces students to the technologies used to develop and deploy mobile applications. The unit covers evaluating organisational needs in the mobile space, responsive web design, web technologies, interface challenges, location awareness, cloud services and data storage.',
    prerequisite: ['300580']
  },
  '300977': {
    name: 'Systems Analysis and Database Management Systems',
    code: '300977',
    level: '7',
    credits: '10',
    coordinator: 'Aruna Jamdagni',
    about:
      'The main purpose of this unit is to provide students with an opportunity to gain knowledge and experience of developing a business information system in a systematic way. This unit examines the general methodology of systems development life cycle, including different phases and various modeling techniques. The unit specialises in the development of a full systems analysis and design documentation by using system development methodologies, including data analysis and modeling methods. It extensively covers database design techniques where students will use a set of business rules obtained from requirements and use case analysis, and database implementation using a commercial database management system. At the same time, student learning, intercommunication and collaborative working skills are enhanced by student participation in tutorial presentations and group assignments.'
  },
  '301004': {
    name: 'Research Preparation in Post Graduate Studies',
    code: '301004',
    level: '7',
    credits: '10',
    coordinator: 'Miroslav Filipovic',
    about:
      "Life is research! This unit introduces students to the nature of research and why it is essential to today's way of living. What are the current and big questions in research? How to prepare for conducting a research in various areas? What are the differences between study, investigation and research? In this unit, the main emphasis will be on different types of modern research and their methods/methodologies with special emphasis on Science, Technology, Engineering & Mathematics (STEM). This unit will also encompass various advanced tools that support research, its writing styles, publication channels and research ethics. Key elements of good research design are also introduced as well as the concepts of intellectual property and commercialisation."
  },
  '301005': {
    name: 'Professional Practice and Communication',
    code: '301005',
    level: '7',
    credits: '10',
    coordinator: 'Aruna Jamdagni',
    about:
      'This unit introduces some of the concepts, standards and techniques associated with the current professional practice for engineering and information technology students. These include the various elements of engineering and IT practice, basic knowledge of contract laws and legal responsibility, competence in verbal and written communication, and an understanding of ethical considerations.'
  },
  '301028': {
    name: 'Advanced Healthcare Data Environments',
    code: '301028',
    level: '7',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      'This unit extends the students knowledge of Health Informatics by introducing concepts relating to electronic communications within the health industry. It exposes students to a variety of environments used to create, store, transfer and deliver healthcare data. Areas include minimum data sets, data linkage, messaging concepts/standards, terminologies, healthcare evaluation, electronic health records and related standards, security, privacy and trust, medico legal, epidemiology and population health together with TeleHealth/TeleMedicine approaches, methodologies, tools and techniques. Advanced skills and knowledge on researching into recent developments in specific sub-topics will be acquired through assessment components in the unit.'
  },
  '301029': {
    name: 'Advanced Healthcare Software and Systems',
    code: '301029',
    level: '7',
    credits: '10',
    coordinator: 'Jim Basilakis',
    about:
      'In this unit students will learn the concepts underpinning the services computing paradigm of "bridging the gap between Business Services and IT Services". Services Computing technology includes Web services and service-oriented architecture (SOA), business consulting methodology and utilities, business process modelling, transformation and integration. Students will learn, through the development of practical examples, how to utilise these technologies within a healthcare context. Advanced knowledge and knowledge of recent developments in specific sub-topics will also be acquired through practical components in the unit.'
  },
  '301031': {
    name: 'Computer Algebra',
    code: '301031',
    level: '2',
    credits: '10',
    coordinator: 'Roozbeh Hazrat',
    about:
      'This unit will introduce the popular computational software Mathematica, through which students will explore and investigate real-world mathematical problems. The unit promotes an experimental side of mathematics and will employ symbolic computation to gain insight and intuition into problems, to discover mathematical patterns and relationships, and create impressive graphics to expose mathematical structures.',
    assumed:
      'Students should be comfortable with high school level of Mathematics and have passed Mathematics 1A. This is required to carry out more advanced projects in the unit.',
    prerequisite: ['300672']
  },
  '301032': {
    name: 'Making Sense of Data',
    code: '301032',
    level: '2',
    credits: '10',
    coordinator: 'Neil Hopkins',
    about:
      'The unit builds on the basic statistical concepts introduced in first year, and also prepares students for broader application of statistics for those majoring in science or business. Topics include hypothesis testing; analysis of categorical data; analysis of variance; non-parametric methods; re-sampling (cross validation/bootstrapping); Introduction to visual data analysis; simple Multivariate statistics and sampling and design.',
    assumed: 'Basic Statistics.',
    prerequisite: ['300700']
  },
  '301033': {
    name: 'Introduction to Data Science',
    code: '301033',
    level: '2',
    credits: '10',
    coordinator: 'Rosalind Wang',
    about:
      'Analysis of data is essential for scientific investigation, modelling processes and predicting future events. Data Science is the investigation of the tools required that allow us to perform this modelling and prediction. The increase in accessible data over the past few decades has promoted the use of Data Science, making it a desired skill in many professions. In this unit we further investigate the methods of regression, clustering and classification that form the basis of a data scientist’s toolbox.',
    assumed: 'Computer Programming.',
    rawPrerequisite: [
      'For students NOT enrolled in 3769 Bachelor of Data Science or 3770 Bachelor of Applied Data Science - 300700 Statistical Decision Making or 200263 Biometry or 200032 Statistics for Business'
    ]
  },
  '301034': {
    name: 'Predictive Modelling',
    code: '301034',
    level: '3',
    credits: '10',
    coordinator: 'Oliver Obst',
    about:
      'Predictive Modelling forms the basis for understanding relationships between input characteristics and outcomes. Predicting insurance risk, defaults on loans and probability of life on other planets are all examples of Predictive Modelling. In this unit we will look at traditional statistical approaches and some machine learning for predictive modelling.',
    rawPrerequisite: [
      'For students not enrolled in 3734 Bachelor of Data Science, 3769 Bachelor of Data Science or 3770 Bachelor of Applied Data Science - 300700 Statistical Decision Making or 200263 Biometry or 200032 Statistics for Business.'
    ]
  },
  '301035': {
    name: 'Environmental Informatics',
    code: '301035',
    level: '3',
    credits: '10',
    coordinator: 'Stephen Weissenhofer',
    about:
      'Today, the environment is becoming more and more in the public eye. Methods of environmental monitoring and data analysis are an important source of information for science, business and government regulation. This unit aims to give students a good introduction to environmental informatics and the analysis of spatio-temporal data.',
    prerequisite: ['300700']
  },
  '301037': {
    name: 'Scientific Informatics',
    code: '301037',
    level: '7',
    credits: '10',
    coordinator: 'Nicholas Tothill',
    about:
      'This unit aims to provide training for Research Masters in the computational techniques that are integral to much of modern scientific research. The unit includes a number of options of which 6 are to be selected. While these options are expected to be relevant to the student’s research field, all of them are designed to provide transferable skills in this topic, and to use a common set of tools, building computing skills for the student’s future.',
    assumed: 'Basic programming knowledge.'
  },
  '301038': {
    name: 'Programming Proficiency',
    code: '301038',
    level: '7',
    credits: '10',
    coordinator: 'Zhuhan Jiang',
    about:
      'This unit is aimed at the students whose undergraduate study is in a discipline other than computing or information technology. This unit first covers the programming fundamentals on data types, conditional selections and loop structures, and then further develops the problem solving skills through the use of user-defined functions, records, files, as well as the basic concept and techniques of object-oriented programming. A high level programming language is employed to implement all the problem solutions.'
  },
  '301042': {
    name: 'Cloud Computing',
    code: '301042',
    level: '7',
    credits: '10',
    coordinator: 'Bahman Javadi Jahantigh',
    about:
      'Cloud computing has become a driving force for information technology over the past several years, and it is moving towards a future in which we won’t rely on local computers, but on centralised facilities operated by third-party compute and storage utilities. Governments, research institutes, and industry leaders are rushing to adopt Cloud Computing to solve their ever-increasing computing and storage problems arising in the Internet Age. This unit offers “Academy Cloud Foundations” (ACF) curriculum as part of Amazon Web Services (AWS) Academy. Students will develop knowledge and skills in the areas of virtualization technologies, cloud architecture, AWS core services and their pricing, security, architecture, and support.',
    assumed: 'Basic knowledge of networking and computer systems.'
  },
  '301043': {
    name: 'Mobile Computing',
    code: '301043',
    level: '7',
    credits: '10',
    coordinator: 'Quang Vinh Nguyen',
    about:
      'This unit teaches technologies and programming languages for developing applications on common mobile platforms, such as Android and iOS. Students will learn skills for developing programs on the above platforms, along with in-class sample applications that highlight platform - specific implementation details.',
    rawPrerequisite: [
      'Students enrolled in 2761 Master of Business Administration, Information and Communication Technology specialisation, must have successfully completed 301038 Programming Proficiency and 300977 Systems Analysis and Database Management Systems.',
      'Students enrolled in all other courses  must have successfully completed 300693 Web Technologies.'
    ]
  },
  '301044': {
    name: 'Data Science',
    code: '301044',
    level: '7',
    credits: '10',
    coordinator: 'Liwan Liyanage',
    about:
      'The explosion of data in the internet age opens up new possibilities for agencies and business to better serve and market to its customers. To take full advantage of these opportunities requires the ability to consolidate, manage and extract information from very large diverse data sets. In science, data sets are growing rapidly, with projects routinely generating terabytes of data. In this unit we examine the software tools and analytic methods that underpin a successful Data Science Project and gain experience in big data analytics.',
    assumed: 'Basic Statistics, Computer Programming'
  },
  '301045': {
    name: 'Advanced Topics in User System Interaction',
    code: '301045',
    level: '7',
    credits: '10',
    coordinator: 'Omar Mubin',
    about:
      'The domain of User System Interaction or also known as Human Computer Interaction (HCI) dictates that IT graduates must be able to develop and evaluate interfaces that not only look professional but are usable, functional and accessible. This post graduate unit also examines HCI as a field of research and discusses novel areas of research in the area. Students in this unit will be required to complete a research project alongside a literature review document both of which comprise of content that is of a standard of being able to be considered for publication and/or presentation in a HCI conference or journal.',
    incompatible: ['300570']
  },
  '301046': {
    name: 'Big Data',
    code: '301046',
    level: '7',
    credits: '10',
    coordinator: 'Miroslav Filipovic',
    about:
      '"Big data" is the label for the ever-increasing gigantic amount of data with which humanity has to cope. The availability of data and the development of cloud computing architectures to process and analyse these data have made data analytics a central tool in our endeavours. This unit will introduce students to the realm of “big data", covering the important principles and technologies of retrieving, processing and managing massive real-world data sets. It is designed to provide the basic techniques required by any discipline that needs to make sense out of the growing amount of data, and to equip students with the knowledge and key set of skills set to be competitive in the growing job market in the analytics field.',
    assumed:
      'It is expected that students enrolled in this unit should have basic programming skills in any programming language and working knowledge in elementary probability and statistics, including the concepts of random variables, basic probability distributions, expectations, mean and variance.'
  },
  '301047': {
    name: 'ICT Practicum',
    code: '301047',
    level: '7',
    credits: '0',
    coordinator: 'Simi Kamini Bajaj',
    about:
      'Students will undertake 120 hours full-time or part-time equivalent industry placements as a Work Integrated Learning (WIL) component required to be completed by students for successful completion of the Master of ICT and Master of ICT (Advanced) courses. Students must seek the approval of the Unit Coordinator for all placements before the commencement of the industry placement. Students will work in an external organisation in Australia or within a department/division within Western Sydney University carrying out tasks related to ICT. This provides students real-world experience in the ICT industry in Australia. Students can nominate an external organisation of their choice however the approval of the Unit Coordinator must be sought before the placement. Students with substantial post-qualification work experience in Australia maybe eligible for advanced standing for this unit.',
    assumed:
      'A broad background knowledge in ICT discipline (i.e. equivalent to that obtained after completing two-three years of ICT/Computing)',
    prerequisite: ['301005']
  },
  '301106': {
    name: 'Mathematical Investigations',
    code: '301106',
    level: '7',
    credits: '10',
    coordinator: 'Stephen Weissenhofer',
    about:
      'Mathematical Investigations will prepare Master of Research for students planning a future in mathematical/statistical research. Students will carry out investigations under the supervision of an academic staff member that will allow development of skills, knowledge and a way of thinking that will assist in the learning of mathematics/statistics that will prepare them for research in their chosen field of mathematics. They will also develop their written and oral communication skills, culminating in a poster presentation of significant findings as if being submitted at a mathematics/statistics conference, following that conference’s directions for submission.',
    assumed: 'Undergraduate level of knowledge in mathematics or statistics'
  },
  '301107': {
    name: 'Analytics Programming',
    code: '301107',
    level: '1',
    credits: '10',
    coordinator: 'Nicholas Tothill',
    about:
      'This unit covers the use of computers and computer programming for Data Science. After briefly considering spreadsheet systems, the unit will consider programming in the statistical system "R" in depth. Finally, other special purpose languages will be touched briefly (eg. SQL).',
    assumed: 'Familiarity with computer software programs such as Excel.'
  },
  '301108': {
    name: 'Thinking About Data',
    code: '301108',
    level: '1',
    credits: '10',
    coordinator: 'Laurence Park',
    about:
      'This Unit covers basic concepts of data centric thinking. The main areas discussed are; Populations and Samples; Sampling concepts; Types of Data; Descriptive Methods; Estimation and Inference; Modelling. The Unit takes a computational and nonparametric approach, before briefly discussing theoretical concepts and distribution theory.',
    assumed: '2 Unit High School Mathematics.'
  },
  '301109': {
    name: 'Visual Analytics',
    code: '301109',
    level: '2',
    credits: '10',
    coordinator: 'Quang Vinh Nguyen',
    about:
      'This unit introduces the fundamentals and technologies of visual analytics to understand big data.  It covers major concepts of information visualisation, human computer perception and methods for visual data analysis. Students will learn knowledge and skills for identifying suitable visual analytics techniques, methods and tools for handling various data sets and applications. The unit  provides students with opportunities to explore novel research in visual analytics and visualisation.',
    assumed: 'Familiarity with computer software programs, such as Microsoft Office.'
  },
  '301110': {
    name: 'Applications of Big Data',
    code: '301110',
    level: '3',
    credits: '10',
    coordinator: 'Nicholas Tothill',
    about:
      'Many techniques and tools have been developed over the past decade to cope with the ever-growing needs for the processing and analysis of big data. This unit will cover the key techniques that have been widely used in big data applications, such as relational and Not Only Structured Query Language (NoSQL) databases, Web Services, parallel and cloud computing, MapReduce, Hadoop and its eco-system. It aims to introduce the emerging technologies and applications in big data to students, and keep up with the latest trends in the industry.',
    assumed: 'Knowledge of computer software, databases, and entry-level statistics.',
    prerequisite: ['301107']
  },
  '301111': {
    name: 'Discovery Project',
    code: '301111',
    level: '3',
    credits: '10',
    coordinator: 'Paul Hurley',
    about:
      "In this unit students will gain experience in applying data science skills and using knowledge gained during their bachelor's course of their primary discipline. Students will carry out a real life project transforming data to knowledge under the supervision of an academic mentor. Students will develop a knowledge discovery project proposal and carry out a literature review highlighting the current status of the problem. Assisted by a mentor they will apply the data science skills learned through-out the degree and produce a final discovery project report and/or interactive project tool and give an oral presentation.",
    assumed: "Completed the bachelor's degree units in the students primary discipline.",
    prerequisite: ['301033']
  },
  '301112': {
    name: 'Visualisation',
    code: '301112',
    level: '7',
    credits: '10',
    coordinator: 'Zhonglin Qu',
    about:
      'This unit introduces the fundamentals and technologies of information visualisation. It covers the major concepts of information visualisation, human-computer perception and methods for visual data analysis. Students will learn the knowledge and skills required for identifying suitable visualisation techniques and tools appropriate for various data types and applications. The unit provides students with opportunities to explore recent research in the visualisation field.',
    assumed: 'Familiarity with computer software programs, such as Microsoft Office.',
    incompatible: ['301109']
  },
  '301113': {
    name: 'Programming for Data Science',
    code: '301113',
    level: '7',
    credits: '10',
    coordinator: 'Luke Barnes',
    about:
      'The use of computers and computer programming for Data Science is fundamental to the discipline. This introductory unit will briefly cover the use of spreadsheet systems and then will consider programming in the statistical system “R” in detail.  Other special purpose languages will also be touched on briefly including SQL (Structured Query Language).',
    assumed: 'Familiarity with computer software programs such as Excel.'
  },
  '301114': {
    name: 'The Nature of Data',
    code: '301114',
    level: '7',
    credits: '10',
    coordinator: 'Paul Hurley',
    about:
      'This Unit covers concepts of data centric thinking. The main areas discussed are; Populations and Samples; Sampling concepts; Types of Data; Descriptive Methods; Estimation and Inference; and Modelling.  The Unit takes a computational and nonparametric approach, before discussing theoretical concepts and Normal distribution theory as large sample approximations.',
    assumed: 'Undergraduate degree with some statistical content (1 unit) is useful.'
  },
  '301115': {
    name: 'Advanced Statistical Methods',
    code: '301115',
    level: '7',
    credits: '10',
    coordinator: 'Laurence Park',
    about:
      'There has been a significant trend away from simple statistical models for complex and Big Data.  Advanced Statistical Methods is a technical unit that looks at computer intensive statistical techniques for modelling complex data. Students will learn about methods including Density Estimation, the Expectation-Maximisation (EM) algorithm, Bayesian, Markovian and Hidden Markov Models, enabling them to apply sophisticated statistical tools in a Data Science setting.',
    prerequisite: ['301113']
  },
  '301116': {
    name: 'Social Media Intelligence',
    code: '301116',
    level: '7',
    credits: '10',
    coordinator: 'Laurence Park',
    about:
      'Social Media Intelligence presents the theory and practice of extracting and analysing information from social media networks. The aims are to identify properties of social networks, and to make predictions about future events. Topics included will cover areas such as Graph theory, Game theory and Network dynamics and we will identify how these can be used to model and extract information from Facebook and Twitter.',
    assumed: 'Basic algebra and computing skills.'
  },
  '301117': {
    name: 'Predictive Analytics',
    code: '301117',
    level: '7',
    credits: '10',
    coordinator: 'Oliver Obst',
    about:
      'Predictive analytics is the use of data, statistical algorithms and machine-learning techniques to model outcomes based on past data. Industry can use predictive analytics to help optimize their operations and performance. This unit introduces statistical ideas and machine learning techniques covering the predictive analytics process. Some example problems that will be discussed include identifying trends, understanding customers and predicting behaviour, fraud detection, and identifying credit risk.',
    prerequisite: ['301114']
  },
  '301118': {
    name: 'Genomic Data Science',
    code: '301118',
    level: '7',
    credits: '10',
    coordinator: 'Alexie Papanicolaou',
    about:
      'Successful data scientists work across multiple business domains, have the ability to rapidly grasp the basics and adapt to achieve the business intelligence outcomes. Further, it is imperative to showcase the thinking of experimental scientists such as forming testable hypotheses and identifying sources of errors. In this unit we delve into the domain of life sciences, learn how to design and conduct biological experiments and use our analytical skills to explore real data from our oral microbiomes.',
    assumed:
      '1). Statistics: Basic understanding of core statistical concepts such as what is a variable in statistics, what is and how to make histograms and summaries of data, Gaussian vs Poisson distributions, how to plot using R;  2). Large scale data management: Basic programming skills (what is a variable in programming, “for” and “while” loops). How to view, manipulate and manage data using a Linux command line (e.g. familiarity with basic bash command line).\r\n\r\nThe HIE course ‘Data Analysis And Visualization With R’ (http://www.westernsydney.edu.au/hie/opportunities/training_courses/data_analysis_r) will fulfil these requirements as will the year 1 MSc Data Science units'
  },
  '301119': {
    name: 'Advanced Machine Learning',
    code: '301119',
    level: '7',
    credits: '10',
    coordinator: 'Oliver Obst',
    about:
      'Advanced Machine Learning explores modern methods of classification, clustering and regression to make predictions and analyse different forms of data. Issues that face all machine learning methods, such as model evaluation, assessment and generalisation will also be analysed.',
    assumed: 'Fundamentals of computer programming and basic linear algebra.',
    prerequisite: ['301113']
  },
  '301123': {
    name: 'Management Analytics',
    code: '301123',
    level: '1',
    credits: '10',
    coordinator: 'Neil Hopkins',
    about:
      'Management Analytics provides students with introductory knowledge and skills in identifying, analysing and interpreting data relevant to Business, Human Resources and Management. In order to develop evidence-based decision-making skills, students will learn how to work with data. Students will organise and summarise data, present data visually and design surveys for new data collection and use. Students will develop skills in understanding decision-making models and forecasting as a means of improving business processes and HR, management and business metrics.',
    assumed: 'HSC maths (2 unit desirable) or equivalent.',
    equivalent: ['200032', '200052', '300700', '200263', '200192', '700007', '700041']
  },
  '301124': {
    name: 'Ethical Hacking Principles and Practice',
    code: '301124',
    level: '3',
    credits: '10',
    coordinator: 'Weisheng Si',
    about:
      'This unit teaches students ethical hacking principles and skills with the ultimate goal of defence. It covers practical skills in different stages of ethical hacking, including reconnaissance on public information, port and vulnerability scanning, exploitation of vulnerabilities, post exploitation, and writing a comprehensive report to document detected vulnerabilities and proposed solutions. Students will not only practice with major tools in ethical hacking, but also learn the principles of how these tools work and hence how to defend against them.',
    assumed:
      'Students should have a solid understanding of computer networking (especially with the TCP/IP protocol suite), possess basic programming skills in developing computer applications and web applications, and command basic knowledge and skills in databases and operating systems.',
    prerequisite: ['300565']
  },
  '301125': {
    name: 'Masters Thesis',
    code: '301125',
    level: '7',
    credits: '80',
    coordinator: 'Yi Zhou',
    about:
      'This year long unit provides an opportunity for masters students to carry out a comprehensive investigation and practical work on a cutting edge research topic in the area of Information and Communication Technologies.  Students are encouraged to select topics they envisage to be of value to their future careers. Students will undertake individual research-intensive project-based study under the guidance of an academic supervisory panel.',
    assumed: 'Prior knowledge deemed appropriate by the project supervisor.',
    prerequisite: ['301005']
  },
  '301162': {
    name: 'Information Security Management',
    code: '301162',
    level: '7',
    credits: '10',
    coordinator: 'Yun Bai',
    about:
      'Cyber Crime costs are increasing at an alarming speed. Security management skills are now essential for IT management. This unit provides the knowledge, skills, techniques and mechanisms on information security management for postgraduate students. It covers topics on management aspects of information security such as business and Cybercrime, security awareness, security risks, security fundamentals, risk assessment and security system design, planning and regulatory issues for information system security.',
    assumed: 'Basic knowledge of computer system, computer security and basic programming skills.'
  },
  '301163': {
    name: 'Modern Software Architectures',
    code: '301163',
    level: '7',
    credits: '10',
    coordinator: 'Rodrigo Neves Calheiros',
    about:
      'Enterprise software architecture comprises a decomposed view of a software system in layers and components that interact and manipulate data to achieve business objectives. Enterprise in this context includes small, medium and large organizations operating in diverse sectors (private, NGO, government). Several architectural patterns have emerged to enable responsive, efficient, secure, and reliable enterprise software. This unit provides a deep understanding of these architectural patterns, examining the motivation, strengths, and limitations of different choices. To demonstrate the broader application of the concepts introduced in the unit, a practical case study is deeply examined.',
    assumed: 'Student must know how to write Objected-Oriented code.',
    equivalent: ['300437', '301041']
  },
  '301164': {
    name: '3D Modelling Fundamentals',
    code: '301164',
    level: '1',
    credits: '10',
    coordinator: 'Tomas Trescak',
    about:
      'This unit will introduce the fundamentals of 3D surface modelling. Students will learn the theory of 3D surface modelling and will gain practical skills in creating 3D assets using a popular software package from Autodesk. They will also learn how to design characters and how to integrate their assets with a purpose of producing complex 3D scenes and animated movies. This unit is aimed at students who have no prior knowledge of 3D modelling and are not familiar with associated software packages.'
  },
  '301165': {
    name: 'Incubator 1: Innovation and Creativity for Entrepreneurship',
    code: '301165',
    level: '2',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'From time to time we hear stories about successful multi-million (or billion) dollar companies that started in a suburban garage. Is it that simple? The heart of the success of entrepreneurship is innovation and creativity. This unit explores the ways innovative ideas for a product or service can be turned into a successful start-up business. As such, this unit will cover topics including, but not limited to: factors essential for being able to initiate a creative idea, what is innovation, stages of developing a conceptual idea. The unit will be delivered through a number of modules. As an integral part of the unit, students are expected to engage and work in “start-up co-working space” on a regular basis. At the successful completion of this unit, students would have some possible start-up options that could be further explored into creating that multi-million (or billion) dollar company.'
  },
  '301167': {
    name: 'Simulation Fundamentals',
    code: '301167',
    level: '2',
    credits: '10',
    coordinator: 'Aruna Jamdagni',
    about:
      'In the last couple of decades computer modelling and simulation has evolved into an important discipline used in nearly every aspect of life from computer games to banking. What was once a tool for training pilots is now a capability to better understand human behaviour, enterprise systems, disease proliferation, and much more. This is an introductory, problem-based unit, where students will learn by doing.  Students will acquire ability to use different simulation methodologies and tools such as InsightMaker and AnyLogic to build new insights into the world around you and learn how to share these insights effectively with others.'
  },
  '301168': {
    name: 'Incubator 3: Product Development',
    code: '301168',
    level: '2',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'A creative spark or innovative idea is not enough to succeed as a start-up organisation. A new idea behind a product or a service needs to be first verified to understand the business opportunities out there. Then the identified opportunities need to be adjusted to formalise in a business concept. This unit aims to guide students through that process of converting the creative or innovative idea into the development of a product or service as a sound business concept. This objective is driven through teams of students advancing with their practical projects and along the way learning about a number of theoretical topics such as:  prototyping, user testing, etc. The unit will be delivered through a number of modules. As a vital part of the unit, students are expected to engage and work in “start-up co-working space” on a regular basis. At the successful completion of this unit, students would have converted the innovative idea into a business product or service.'
  },
  '301169': {
    name: 'Incubator 4: Commercial and Financial Setting of Entrepreneurship',
    code: '301169',
    level: '3',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'Operating a start-up is not just about being creative and innovative; it is also about having the necessary management and operational skills, understanding the commercial and financial setting within which the organisation needs to operate it. This unit aims to provide vital details that set the background to run your organisation whether your customer base is local, national or even international. This objective is driven through a number of topics such as: setting up a business entity, accounting fundamentals, taxation fundamentals. The unit will be delivered through a number of modules. As a vital part of the unit, students are expected to engage and work in “start-up co-working space" on a regular basis. At the successful completion of this unit, students would set up as a business entity for their start-up organisation.'
  },
  '301170': {
    name: 'Incubator 5: Operational Aspects of Entrepreneurship',
    code: '301170',
    level: '3',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      "Planning is an important part of setting up a start-up business. This would require investigating into setting goals, figuring out how to track progress, what to do when things don't go to plan and also to communicate your business concept to others, such as potential investors. This unit aims to develop the skills and knowledge required for making a business plan for the start-up organisation through a number of theoretical topics, such as: developing marketing and operational plans, staffing and management.  At the completion of this unit, students will have developed a viable business plan for their start-up."
  },
  '301171': {
    name: 'Incubator 6: Funding and Start-up',
    code: '301171',
    level: '3',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'This unit investigates various funding opportunities that might be suitable for your business concept through a number of theoretical topics, such as: possible funding sources including venture capitalists and angel investors, joint venture funding, pitching your ideas. The unit is structured into a number of modules. Further, as activities associated with this unit, students would have to actively seek and secure funding for the start-up.'
  },
  '301172': {
    name: 'Incubator 7: Growth and Exit Strategies',
    code: '301172',
    level: '3',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'This unit will assist students with selecting the further growth strategy, which includes deciding whether their business would grow organically or will require a fast growth model and rapid expansion strategies. The growth strategy will determine further funding decisions. Apart from this, as entrepreneurs, the students would need to also consider possible exit strategies (e.g. initial public offering (IPO), trade sales or personal redundancies). This objective is driven through a number of topics such as: elements of market research and strategies for business growth, risk management, possible exit strategies, etc. The unit will be delivered through a number of modules. As a tangible outcome, at the completion of this unit, students would have developed a future growth plan with an identification of possible exit strategies.'
  },
  '301173': {
    name: 'Special Effects Programming',
    code: '301173',
    level: '3',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'This unit will focus on develop programming code to write shaders to create special effects, such as fog, shadows, fire, water, clouds, lightning, motion blur and reflections. These type of shaders are often seen in games and movies. Students will also learn about generic programming algorithms involved in building special effects.'
  },
  '301174': {
    name: 'Artificial Intelligence',
    code: '301174',
    level: '3',
    credits: '10',
    coordinator: 'Vernon Asuncion',
    about:
      'This unit provides basic studies in the major areas of artificial intelligence: search, knowledge representation, logic programming, machine learning and knowledge based systems, agent planning and learning. The first part of this unit will focus on the foundation of artificial intelligence: search algorithms and their implementations, game playing, logics and knowledge representation, and inference in reasoning systems. The second part will cover the principles of knowledge based systems (intelligent systems), planning, and machine learning.',
    assumed:
      'Basic understanding of data structures and algorithms and basic programming skills in Pascal C/C++ or Java etc',
    prerequisite: ['200025'],
    equivalent: ['300087']
  },
  '301175': {
    name: 'Internet of Things',
    code: '301175',
    level: '7',
    credits: '10',
    coordinator: 'Seyed Shahrestani',
    about:
      'The Internet of Things (IoT) is drastically changing the way organisations operate and how individuals interact with the world. IoT is an infrastructure consisting of fairly constantly communicating objects, or things, that may be smart and process or act on data. The IoT facilitates detailed and meaningful interactions between humans, digital devices, and many other industrial and household equipment, appliances, and things. The IoT is also the enabler of smart environments, including smart homes, buildings, cities, transport, and healthcare, among many others. This unit discusses IoT technologies and applications in detail. It also introduces the students to trends, challenges, and key research topics in relevant areas.',
    assumed:
      'Students should be familiar with the fundamentals of computer networking. In particular, they should have a good understanding of the TCP/IP protocol suite, and current networking and wireless technologies. Therefore, it is strongly advisable that the students must have either taken an appropriate unit in computer networking (e.g., 300695 Network Technologies), or have equivalent knowledge.'
  },
  '301176': {
    name: 'Advanced Mathematical Investigations',
    code: '301176',
    level: '7',
    credits: '20',
    coordinator: 'Oliver Obst',
    about:
      "Advanced Mathematical Investigations is an integral part of the Master of Research for students planning a future in mathematical and/or statistical research. Students will carry out extensive investigations under the supervision of an academic staff member that will allow the development of skills, knowledge and a way of thinking that will assist in the learning of mathematics and/or statistics needed for research in their chosen field of mathematics. They will also develop their written and oral communication skills, culminating in a paper which will be written as though it is to be submitted to a mathematics/statistics journal for publication (including following the journal's requirements for presentation) and an oral presentation of the style expected at a mathematics/statistics conference.",
    assumed: 'Undergraduate level of knowledge in mathematics or statistics'
  },
  '301177': {
    name: 'Mathematical Proof and Reasoning',
    code: '301177',
    level: '7',
    credits: '10',
    coordinator: 'Stephen Weissenhofer',
    about:
      'Proving and getting a new proposition by careful reasoning from given propositions, is the essence of mathematics. Proof is what makes mathematics special and eternal. This unit looks at the different methods of proof and reasoning that can be employed to verify that statements are true or not. Students will consider propositions and theorems from various areas of mathematics and look at classic, interesting and sometimes novel ways these can be proved. Successful students taking this unit will not only be able to follow and determine if a proof is correct, but become proficient at mathematical reasoning.',
    assumed: 'Undergraduate level of knowledge in mathematics or statistics'
  },
  '301178': {
    name: 'Advanced Health Classifications and Coding',
    code: '301178',
    level: '7',
    credits: '10',
    coordinator: 'Anupama Ginige',
    about:
      'This unit is designed to enable the student to classify diseases and interventions using the current version of the International Statistical Classification of Diseases and Related Health Problems, Tenth Revision, Australian Modification, the Australian Classification of Health Interventions and the Australian Coding Standards (ICD-10-AM/ACHI/ACS). The unit will also include the historical development of clinical classification systems as well as the purpose and value of classifying diseases and interventions within the health system. The students will become familiar with the structure and content of ICD-10-AM ACHI/ACS and be introduced to the rules and conventions associated within ICD-10-AM/ACHI. Further, students will carry out research based analytical tasks gaining an in-depth knowledge in relation to health classification systems and terminology systems such as SNOMED-CT (Systematized Nomenclature of Medicine - Clinical Terms).',
    assumed: 'Student must have a general knowledge in relation to healthcare systems'
  },
  '301196': {
    name: 'Advanced Topics in Artificial Intelligence',
    code: '301196',
    level: '7',
    credits: '10',
    coordinator: 'Dongmo Zhang',
    about:
      'This unit introduces the most fundamental techniques of artificial intelligence (AI), including knowledge representation, searching, machine learning and intelligent agents. Students will learn the basic theories and algorithms that are essential in the design and development of intelligent systems. The unit will focus on two typical AI applications: game playing and e-trading. Students will have the chance of using existing multiagent system platforms to design and develop intelligent software for game playing and automated trading in e-markets.',
    assumed:
      'This unit requires basic skills in programming with either JAVA or C++ as the programming language.',
    incompatible: ['300245']
  },
  '301203': {
    name: 'Introduction to Cloud Computing',
    code: '301203',
    level: '3',
    credits: '10',
    coordinator: 'Bahman Javadi Jahantigh',
    about:
      'This unit, the first half of Amazon Web Services (AWS) Academy Cloud Computing Architecture curriculum, provides deep understanding of fundamental cloud computing concepts and how it can be applied to build cost-effective; highly available and fault tolerant systems. Students will learn concepts including system virtualisation; virtual machines; cloud networks; basic cloud storage and cloud databases; security in clouds; and auto-scaling, load balancing, and monitoring. All these aspects are explored in practice with AWS services.',
    prerequisite: ['300565']
  },
  '301204': {
    name: 'Cloud Computing Architecture',
    code: '301204',
    level: '3',
    credits: '10',
    coordinator: 'Rodrigo Neves Calheiros',
    about:
      'This unit, the second part of the Amazon Web Services (AWS) Academy Cloud Computing Architecture curriculum, provides deeper understanding about advanced cloud computing services and how to architect cloud applications that are scalable, reliable, and efficient in terms of cost and performance. Students will learn advanced cloud computing concepts including notification and messaging, serverless computing, API gateways, NoSQL databases, content delivery networks, stream processing, and long-term storage. The unit also covers advanced cloud security and infrastructure automation. All these aspects are explored in practice with AWS services. Upon completion of this unit, students will be prepared for the AWS Certified Solutions Architect – Associate exam.',
    prerequisite: ['301203']
  },
  '301205': {
    name: 'Robotic Programming',
    code: '301205',
    level: '3',
    credits: '10',
    coordinator: 'Vernon Asuncion',
    about:
      'Robot Operating System (ROS) is a software integration system that is now widely used for robotics software deployment. The philosophy behind ROS is to modularise software that can work for other robots through small changes in the code. This unit focuses on the main concepts of software development under ROS by looking at the file hierarchical systems (e.g. Packages, Stacks, Messages, Services and others), module communication types through Nodes, Topics, Services, Messages, Bags, Master and how they integrate to operate robot sensors and actuators. This unit also looks at actual AI software examples using C++/Python and Answer Set Programming (ASP).',
    assumed: 'Basic knowledge of Linux, C++/Python and Object Oriented Programming (OOP).',
    rawPrerequisite: [
      '300147 Object Oriented Programming and 300167 Systems Programming 1\r\n\r\nOR\r\n\r\n300147 Object Oriented Programming and 300698 Operating Systems Programming\r\n\r\nOR\r\n\r\n300043 Mobile Robotics'
    ]
  },
  '301206': {
    name: 'Incubator 2: Start-up Essentials',
    code: '301206',
    level: '2',
    credits: '10',
    coordinator: 'Anton Bogdanovych',
    about:
      'There are unavoidable legal situations and ethical dilemmas in all professions. As an entrepreneur, facing these legal and ethical circumstances is much more formidable. This unit aims to prepare students to understand the legal and ethical landscape that applies to start-up (or any) organisation. As such, unit aims to cover the topics such as: creating a business plan, negotiating employment contracts, etc. The unit will be delivered through a number of modules. As an integral part of the unit, students are expected to engage and work in “start-up co-working space” on a regular basis. At the successful completion of this unit, students would have developed a thorough understanding of the local and international legal and ethical landscape within which modern start-up organisations operate.',
    equivalent: ['301166']
  },
  '301235': {
    name: 'Applied Cybersecurity',
    code: '301235',
    level: '7',
    credits: '10',
    coordinator: 'Jim Basilakis',
    about:
      'This unit covers the current approaches, technologies, and applied practices pertinent to cybersecurity and helps the student to understand important related protocols and standards. It describes the features needed for the mitigation of cyber vulnerabilities for improving the reliability of the underlying systems, privacy preservation, and achieving protections against cybercrime and internet fraud. It also examines the basics of ethical hacking, network assurance, cyber risk management, and incident analysis. The unit discusses the trends in applied cybersecurity and introduces some of the relevant current key research issues and features of the field.',
    prerequisite: ['300695']
  },
  '301236': {
    name: 'Advanced Topics in Cybersecurity',
    code: '301236',
    level: '7',
    credits: '10',
    coordinator: 'Seyed Shahrestani',
    about:
      'This unit focuses on the advanced features of Cybersecurity, contemporary views on security, and the solutions that aim to protect the emerging services and technologies. The emphasis is on the development of student skills to enable them to do proficient research and development works and studies in the cybersecurity discipline. On successful completion of this unit, students will be equipped with an in-depth understanding of relevant issues, attacks on massively interconnected systems, and the evolving approaches to improve the reliability of advanced services.',
    assumed:
      'The students should be familiar with the fundamentals of computer networking and security. It is advisable that the students must have either taken appropriate units in these areas (e.g., 300695 Network Technologies and 300696 Systems and Network Security) or have equivalent knowledge.'
  },
  '301247': {
    name: 'A Cosmic Perspective',
    code: '301247',
    level: '7',
    credits: '10',
    coordinator: 'Ain De Horta',
    about:
      'The unit explores and challenges scientific as well as cultural perspectives on the cosmos, from its composition, expansion and the development and endings of the stars and planets, to life, its limits, evolution and mass extinctions on Earth. The unit also considers the development of consciousness, astrology vs astronomy, expanding horizons, space travel and space exploration.',
    assumed:
      'Knowledge of Mathematics equivalent to 2-unit HSC, and experience with the use of computer software such as Excel or Word would be beneficial. Previous experience of statistics or computer programming will be an advantage but is not essential.'
  },
  '301248': {
    name: 'Space Instrumentation, Technology and Communication',
    code: '301248',
    level: '7',
    credits: '10',
    coordinator: 'Nicholas Tothill',
    about:
      'The Space Instrumentation, Technology and Communication unit is focussed on the application of space technology in industrial settings. Its main objective is to provide a sound knowledge of the underlying principles which form a thorough basis for careers in space technology, satellite communications and related fields.\r\n\r\nThis unit gives the student grounding in the technologies used in space science. By considering the underlying scientific principles and case studies of the instrumentation used in space, students will not only understand the current state of the art in space science, but also the foundations of the field in order to be able to stay current in this fast-moving field. Content includes but is not limited to: Imaging, Detectors, Principles of Communication, and Principles of Space Technology.',
    assumed:
      'Knowledge of Mathematics equivalent to 2-unit HSC, and experience with the use of computer software such as Excel or Word would be beneficial. Previous experience of statistics or computer programming will be an advantage but is not essential.'
  },
  '301249': {
    name: 'Space Science, Planetary Science and Meteorology',
    code: '301249',
    level: '7',
    credits: '10',
    coordinator: 'Luke Barnes',
    about:
      'This unit examines the six key priorities of the Australian Space Agency: communication, space debris monitoring, navigation and positioning, Earth observation, space technology research and development, and remote asset management. Students will examine the Sun and Solar System, planetary science, meteorology, and the physics of rockets and satellites. Students will explore the interconnections between the Earth land, ocean, atmosphere, and life of our planet in the era of modern satellite technologies. These include the critical review of our understanding about the cycles of water, carbon, rock, and other materials that continuously shape, influence, and sustain Earth and its inhabitants. Students will also be able to design new models of the cyclical interactions between the Earth system and the Sun, Moon and will discover the fundamental processes which define our Universe and our planet.',
    assumed:
      'Knowledge of Mathematics equivalent to 2-unit HSC, and experience with the use of computer software such as Excel or Word would be beneficial. Previous experience of statistics or computer programming will be an advantage but is not essential.'
  },
  '301312': {
    name: 'Applied Machine Learning',
    code: '301312',
    level: '7',
    credits: '10',
    coordinator: 'Vernon Asuncion',
    about:
      'This unit introduces the foundation and concepts underpinning Machine Learning (ML) at a more abstract level, and provides more focus on its practical applications in areas such as: the classification and extraction of text data from various documents and web pages, image processing, Google’s PageRank algorithm and relational data mining (RDM). These learning objectives are achieved through various ML software and a series of practicals and projects. The unit covers the concepts and notions of supervised, unsupervised and reinforcement learning, perceptron, neural networks, support vector machines (SVM), knowledge representation (KR) based RDM, and a comprehensive introduction to the Scikit-learn ML Python libraries.',
    assumed: 'Some probability and statistics knowledge would be advantageous.'
  },
  '301313': {
    name: 'Natural Language Understanding',
    code: '301313',
    level: '7',
    credits: '10',
    coordinator: 'Vernon Asuncion',
    about:
      'Natural Language Understanding involves machine reading comprehension and the technologies using it are becoming increasingly widespread. This unit provides a foundation in using the Natural Language Toolkit, which is a leading platform for building Python programs working with ‘human language’ data, as well as an introduction to Python for Natural Language Processing. Students will use algorithms and explore accessing text corpora and processing raw text; categorising words and classifying text; understanding information from text and analysing sentence structures; and understanding semantic meanings of sentences. Students also gain real-world hands-on experience with Natural Language Understanding through the practical tasks and assignments.',
    assumed:
      'There are no assumed knowledge for this unit although an undergraduate degree with some probability and statistics is advantageous.'
  },
  '301314': {
    name: 'Artificial Intelligence Ethics and Organisations',
    code: '301314',
    level: '7',
    credits: '10',
    coordinator: 'Jiansheng Huang',
    about:
      'Artificial Intelligence Ethics and Organisations provides students with a comprehensive grounding in the ethical issues of AI technologies. Students will learn about the relevant laws, regulations and policies with respect to AI ethics, and the existing framework and research trend in the field. With a series of case studies, students will learn how to apply general principles and guidelines in practice. They will also learn to identify potential risks and impacts, to ensure AI ethics are followed in different circumstances regarding data governance, automatic decisions, predictive analytics, autonomous system design and deployment, and structure changes of labour markets.',
    assumed:
      'General knowledge of artificial intelligence technologies and applications, including machine learning, robotics and autonomous systems, natural language processing and expert systems.'
  },
  '301315': {
    name: 'Knowledge Representation and Reasoning',
    code: '301315',
    level: '7',
    credits: '10',
    coordinator: 'Yan Zhang',
    about:
      'Knowledge representation and reasoning is one of the fundamental components of Artificial Intelligence. It studies ways to represent and reason about human knowledge effectively in formal computational models, and eventually to solve complex tasks using computer systems. This unit covers logic foundations of knowledge representation, Answer Set Programming approaches for declarative problem solving, intelligent agent modelling, and theory and practice of knowledge graphs.'
  },
  '301363': {
    name: 'Advanced Cloud Computing',
    code: '301363',
    level: '7',
    credits: '10',
    coordinator: 'Rodrigo Neves Calheiros',
    about:
      'This unit offers the Amazon Web Services (AWS) Academy “Academy Cloud Architecting” (ACA) curriculum and provides deeper understanding of advanced cloud computing services and how to architect cloud solutions. Students will learn advanced cloud computing concepts including notification and messaging, serverless computing, API gateways, NoSQL databases, and content delivery networks. The unit also explores strategies to enable high scalability, reliability, cost-efficiency, performance, and operational excellence in a cloud-based system. All these aspects are explored in practice with AWS services. Upon completion of this unit, students will be prepared for the AWS Certified Solutions Architect – Associate exam.',
    prerequisite: ['301042']
  },
  '700000': {
    name: 'Information Systems in Context (WSTC)',
    code: '700000',
    level: '1',
    credits: '10',
    coordinator: 'Frank Gutierrez',
    about:
      'This unit aims to give students the ability to recognise and explain business information systems with regard to type, function, and purpose, and the frameworks within which these systems are used.  Topics in this unit include computing fundamentals; computer hardware and software; computers and society; use of business application packages – spreadsheets,  word processing, database, graphics; organisational information systems; information systems development and acquisition; data and knowledge management; electronic commerce, internets, extranets; networking; enterprise-wide information systems; the internet and information systems security; privacy, ethics and computer crime.',
    rawPrerequisite: [
      'Students enrolled in 7138 Diploma in Information and Communications Technology Extended - ICT, 7139 Diploma in Information and Communications Technology Extended or 7140 Diploma in Information and Communications Technology Extended – Information Systems must pass 700276 Academic and Professional Communication (WSTC  Prep) and 700205 Academic Skills for ICT (WSTC Prep).'
    ],
    equivalent: ['300573']
  },
  '700007': {
    name: 'Statistics for Business (WSTC)',
    code: '700007',
    level: '1',
    credits: '10',
    coordinator: 'Michael CASEY',
    about:
      'This unit introduces the basic concepts and techniques of statistics that are particularly relevant to problem solving in business. It also provides a sound base for more advanced study in statistics and forecasting in subsequent sessions. Topics include: presentation of data; descriptive statistics; the role of uncertainty in business decision making; hypothesis testing.',
    assumed: 'Mathematics, equivalent to the Mathematics subject in the NSW HSC',
    equivalent: ['200032'],
    incompatible: ['200192', '200052', '200182', '200263']
  },
  '700008': {
    name: 'Programming Fundamentals (WSTC)',
    code: '700008',
    level: '1',
    credits: '10',
    coordinator: 'Buddhima De Silva',
    about:
      'As a first unit in computer programming, Programming Fundamentals covers the basics of developing software with an emphasis on procedural programming.  Students will learn about basic data structures, the concept of algorithms, fundamental programming constructs, common programming language features and functions, program design and good programming style.   A high level programming language is combined with a highly visual framework to teach problem solving using software.',
    rawPrerequisite: [
      'Students enrolled in 7067 Diploma in Information and Communications Technology Extended  must pass 700199 Academic Communication 2 (WSTC Prep) or 700208 English for Tertiary Study 2 (WSTC Prep) or 700210 Introduction to Academic Communication 2 (WSTC Prep), and must pass 700201 Computer Studies (WSTC Prep), and must pass 700047 Programming Design (WSTC Prep), and must pass 700146 Mathematics 2 (WSTC Prep) before enrolling in this unit. \r\n\r\nStudents enrolled in 6035 Diploma/Bachelor of Information and Communications Technology, 6036 Diploma in Information and Communications Technology/Bachelor of Information Systems and 7005 Diploma in Information and Communications Technology must pass 700047 Programming Design (WSTC Prep) before enrolling in this unit.\r\n\r\nStudents enrolled in 6038 Dip in Information and Communications Technology /BICT(HIM), 6039 Diploma in Information and Communications Technology/BICT, 6040 Diploma in Information and Communications Technology/BIS , 7067 Diploma in Information and Communications Technology Extended, 7134 Diploma in Information and Communications Technology Extended - ICT, 7138 Diploma in Information and Communications Technology Extended-ICT, 7139 Diploma in Information and Communications Technology Extended, 7140 Diploma in Information and Communications Technology Extended–IS, 7141 Diploma in Information and Communications Technology Extended-HIM, 7163 Diploma in Information and Communications Technology(International) and 7164 Dip Information and Communications Technology (HIM) (International) must pass 700047 Programming Design (WSTC Prep) and must pass 700146 Mathematics 2 (WSTC Prep) before enrolling in this unit.'
    ],
    equivalent: ['300405', '300155', '200122', '300580']
  },
  '700011': {
    name: 'Database Design and Development (WSTC)',
    code: '700011',
    level: '2',
    credits: '10',
    coordinator: 'Frank Gutierrez',
    about:
      'The main purpose of this unit is to provide students with an opportunity to gain a basic knowledge of database design and development including data modeling methods, techniques for database design using a set of business rules that are derived from a case study and finally implementation of the database using a commercial relational database management system. The unit also examines a number of important database concepts such as database administration, concurrency, backup and recovery and security. At the same time student learning and intercommunication skills are enhanced by running tutorial presentations and group assignments.',
    assumed:
      'Basic programming skills, including variable declaration, variable assignment, selection statement and loop structure.',
    rawPrerequisite: [
      'Students enrolled in 7067 Diploma in Information and Communications Technology Extended and 7134 Diploma in Information and Communications Technology Extended – ICT must pass 700199 Academic Communication 2 (WSTC Prep) or 700208 English for Tertiary Study 2 (WSTC Prep) or 700210 Introduction to Academic Communication 2 (WSTC Prep) and must pass 700201 Computer Studies (WSTC Prep) and must pass 700047 Programming Design (WSTC Prep) before enrolling in this unit.',
      'Students enrolled in 7138 Diploma in Information and Communications Technology Extended-ICT, 7139 Diploma in Information and Communications Technology Extended, 7140 Diploma in Information and Communications Technology Extended–IS, and 7141 Diploma in Information and Communications Technology Extended-HIM must pass 700276 Academic and Professional Communication (WSTC Prep) and must pass 700278 Information Technology in Business (WSTC Prep) and must pass 700047 Programming Design (WSTC Prep).',
      'Students enrolled in 6038 Diploma in Information and Communications Technology /Bachelor of Information and Communications Technology (HIM), 6039 Diploma in Information and Communications Technology/Bachelor of Information and Communications Technology, 6040 Diploma in Information and Communications Technology/Bachelor of Information Systems, 7163 Diploma in Information and Communications Technology and 7164 Diploma in Information and Communications Technology (HIM)  must pass 700047 Programming Design (WSTC Prep).'
    ],
    equivalent: ['300104']
  },
  '700012': {
    name: 'Computer Networking (WSTC)',
    code: '700012',
    level: '2',
    credits: '10',
    coordinator: 'Buddhima De Silva',
    about:
      'This is an introductory unit in computer systems networking.  It covers basic networking technologies, Ethernet fundamentals, ISO OSI model, routing, switching and sub-netting, the internet architecture, networking protocols, including TCP/IP, important OSI layer 2 and 3 networking device fundamentals, basic network management and security issues.  This unit is also the first of three units which will prepare students for industry based networking certification (CCNA).',
    assumed:
      'Fundamentals of computer architecture, binary and hexadecimal numbering systems and programming principles. Students should also have a working knowledge of the World Wide Web.',
    rawPrerequisite: [
      'Students enrolled in 7067 Diploma in Information and Communications Technology Extended and 7134 Diploma in Information and Communications Technology Extended – ICT must pass 700199 Academic Communication 2 (WSTC Prep) or 700208 English for Tertiary Study 2 (WSTC Prep) or 700210 Introduction to Academic Communication 2 (WSTC Prep), and must pass 700201 Computer Studies (WSTC Prep) before enrolling in this unit.\r\n\r\nStudents enrolled in 7138 Diploma in Information and Communications Technology Extended-ICT, 7139 Diploma in Information and Communications Technology Extended, 7140 Diploma in Information and Communications Technology Extended–IS and 7141 Diploma in Information and Communications Technology Extended-HIM must pass 700276 Academic & Professional Communication (WSTC Prep) and must pass 700205 Academic Skills for ICT (WSTC Prep) before enrolling in this unit.'
    ],
    equivalent: ['300094', '300086', '300565']
  },
  '700013': {
    name: 'Systems Analysis and Design (WSTC)',
    code: '700013',
    level: '1',
    credits: '10',
    coordinator: 'Buddhima De Silva',
    about:
      'This unit introduces the concepts of System Analysis and Design. The study of methodologies and techniques for problem recognition, requirement analysis, process modelling and/or data modelling are essential elements of this unit. The Systems Development Life Cycle model is employed as the prime approach to teach the unit, providing students with the basic skills required for analysis and design of logical solutions to information systems problems. The use of Computer Aided System Engineering tools will be discussed in practical sessions.',
    assumed:
      'Students should have knowledge of the fundamentals of information systems, computer systems, computer applications and information processing',
    rawPrerequisite: [
      'Students enrolled in 7067 Diploma in Information and Communications Technology Extended must pass 700199 Academic Communication 2 (WSTC Prep) or 700208 English for Tertiary Study 2 (WSTC Prep) or 700210 Introduction to Academic Communication 2 (WSTC Prep), and must pass 700201 Computer Studies (WSTC Prep) before enrolling in this unit.\r\n\r\nStudents enrolled in 7138 Diploma in Information and Communications Technology Extended-ICT, 7139 Diploma in Information and Communications Technology Extended, 7140 Diploma in Information and Communications Technology Extended–IS and 7141 Diploma in Information and Communications Technology Extended-HIM must pass 700276 Academic & Professional Communication (WSTC Prep) and must pass 700205 Academic Skills for ICT (WSTC Prep) and must pass 700278 Information Technology in Business (WSTC Prep) before enrolling in this unit.'
    ],
    equivalent: ['300131', '300585']
  },
  '700019': {
    name: 'Mathematics for Engineers 1 (WSTC)',
    code: '700019',
    level: '1',
    credits: '10',
    coordinator: 'Zdenka Misanovic',
    about:
      'The content of this unit covers a number of topics that underpin the later-stage engineering mathematics units.  The subject matter includes:  differential and integral calculus of a single variable, complex numbers, aspects of matrix algebra, vectors and some elementary statistics and probability theory.',
    prerequisite: ['700100'],
    equivalent: ['200237', '700101'],
    incompatible: ['300672', '300673', '200191']
  },
  '700033': {
    name: 'Biometry (WSTC)',
    code: '700033',
    level: '1',
    credits: '10',
    coordinator: 'Michael CASEY',
    about:
      'This unit introduces students to various statistical techniques necessary in scientific endeavours.  Presentation of the content will emphasize the correct principles and procedures for collecting and analysing scientific data, using a ‘hands-on’ approach.    Topics include effective methods of gathering data, statistical principles of designing experiments, error analysis, describing different sets of data, probability distributions, statistical inference, non-parametric methods, and simple linear regression and correlation.',
    assumed: 'Basic computer use.  Basic understanding of mathematical algebra.',
    equivalent: ['200032', '200052', '200192', '200263', '300700', '700007', '700041'],
    incompatible: ['200182']
  },
  '700039': {
    name: 'Object Oriented Analysis (WSTC)',
    code: '700039',
    level: '2',
    credits: '10',
    coordinator: 'Buddhima De Silva',
    about:
      'The core strength of this unit is to analyse and model business objectives and critical requirements of software systems to be developed using object-oriented (OO) approaches. The system analysis is taken to greater depths within the context of object orientation.  The Unified Modelling Language version 2.0 (notably use cases, activity diagrams, class diagrams and sequence diagrams) is used as a modelling standard for creating OO models in the problem space.  The unit also covers the rational unified process methodology and applications of design patterns for software development through practical case studies.',
    assumed:
      'General understanding of what an information system is and how information systems development is undertaken and Introductory knowledge about system analysis and design, including \r\n- basic problem solving experience in computerised information systems\r\n- ability to derive systems requirements from problem definitions\r\n- ability to produce system models using process, data, object and network modelling.\r\n- understanding design and implementation issues include, (but may not be limited to), elementary database design, input, output and user interface design and prototyping.',
    rawPrerequisite: [
      'Students enrolled in 7004 Diploma in Information and Communications Technology Fast Track, 7005 Diploma in Information and Communications Technology, 7067 Diploma in Information and Communications Technology Extended, 7134 Diploma in Information and Communications Technology Extended – ICT, 7138 Diploma in Information and Communications Technology Extended - ICT, 7139 Diploma in Information and Communications Technology Extended, 7140 Diploma in Information and Communications Technology Extended - Information Systems, 7163 Diploma in Information and Communications Technology, 6035 Diploma/Bachelor of Information and Communications Technology, 6036 Diploma in Information and Communications Technology/Bachelor of Information Systems, 6039 Diploma/Bachelor of Information and Communications Technology and 6040 Diploma in Information and Communications Technology / Bachelor of Information Systems, must pass 700013 Systems Analysis and Design before enrolling in this unit.'
    ],
    equivalent: ['300144']
  },
  '700041': {
    name: 'Statistical Decision Making (WSTC)',
    code: '700041',
    level: '1',
    credits: '10',
    coordinator: 'Michael CASEY',
    about:
      'Statistical Decision Making introduces students to various statistical techniques supporting the study of computing and science.  Presentation of the content will emphasise the correct principles and procedures for collecting and analysing scientific data, using information and communication technologies.  Topics include describing different sets of data, probability distributions, statistical inference and simple linear regression and correlation.',
    rawPrerequisite: [
      'Students enrolled in 7005 Diploma in Information and Communications Technology, 7067 Diploma in Information and Communications Technology Extended, 7104 Diploma in Information and Communications Technology (Health Information Management), 7106 Diploma in Information and Communications Technology (Health Information Management) Extended must pass 700045 Statistics for Academic Purposes (WSTC Prep) before enrolling in this unit.'
    ],
    equivalent: ['200192', '200263', '200032', '200052', '300700', '700007', '700033'],
    incompatible: ['200182']
  },
  '700123': {
    name: 'Quantitative Thinking (WSTC)',
    code: '700123',
    level: '1',
    credits: '10',
    coordinator: 'Michael CASEY',
    about:
      'This Level 1 unit develops the quantitative skills that underpin many fields of study in the sciences.  The content covered includes basic algebra, functions, graphs, equations – linear and quadratic, introductory probability and descriptive statistics.  These mathematical/statistical concepts will be revised and developed using scientific concepts such as molarity and dilution, optical density, population growth, and predator-prey models.  In all aspects of this unit, students will be developing and using critical thinking skills to solve mathematical/statistical problems set in a scientific context.',
    assumed:
      'Basic competence in algebraic manipulation and some familiarity with elementary probability and statistical concepts.',
    equivalent: ['200191', '300831']
  },
  '700126': {
    name: 'Design Science (WSTC)',
    code: '700126',
    level: '1',
    credits: '10',
    coordinator: 'Robert Paluzzano',
    about:
      'An explanation and description of how the built environment works is essential to designers and construction professionals. This unit provides an introduction to physical units of measurement, tolerance, statics, dynamics, acoustics and thermal properties. It also allows students to interpret and apply the concepts of electricity, energy, work and power to the built environment. Students engage with these concepts through a hands-on learning experience including practical projects and live demonstrations.',
    assumed: 'The content of any NSW HSC Mathematics subject',
    rawPrerequisite: [
      'Students enrolled in 7015 Diploma in Construction Management or 7065 Diploma in Construction Management Extended or 7042 Bachelor of Construction Management (WSTC FYP) or 7081 Bachelor of Construction Management Extended (WSTC FYP) must pass 700264 Scientific Methods for Construction Management (WSTC Prep) before enrolling in this unit.'
    ],
    equivalent: ['300016\t']
  },
  '700257': {
    name: 'Programming Techniques (WSTC)',
    code: '700257',
    level: '2',
    credits: '10',
    coordinator: 'Buddhima De Silva',
    about:
      'This unit is intended as a second unit of study in programming. It builds on a basic understanding of procedural programming as would be developed in a first unit. This unit continues the development of programming skills and methodologies required for professional programming and for further study in later computing units. Topics covered include multi-dimensional arrays, file I/O, searching and sorting, and an introduction to object-oriented programming involving classes and inheritance',
    prerequisite: ['700008'],
    equivalent: ['300581'],
    incompatible: ['300903']
  },
  '700258': {
    name: 'Introduction to Health Informatics (WSTC)',
    code: '700258',
    level: '2',
    credits: '10',
    coordinator: 'Frank Gutierrez',
    about:
      "This introductory unit aims to give the student an insight into the key knowledge and skill set required in the emerging domain of Health Informatics. Critical topics include: The Australian healthcare system, health care improvement modelling, health information systems and management, paper-based v's electronic health records, clinical documentation and data quality, health information management, consumer information security, privacy and ethics, decision support and clinical delivery support systems, healthcare data representation and interchange standards, telehealth and ICT technologies. This will be complemented by practical exercises and assessment support sessions. Through these experiences students will gain an understanding of the application of ICT to the healthcare domain and the skills necessary to play a pivotal role in the design and delivery of healthcare systems and health information management.",
    equivalent: ['300566']
  }
};

const arr = Object.keys(units).map(k => units[k]);

const nop = arr.filter(a => !a.prerequisite);
console.log(nop.length / arr.length);

const ass = arr.filter(a => !a.assumed);
console.log(ass.length / arr.length);
